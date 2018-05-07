var fs = require('fs');
var path = require('path');
var formatValue = require('./formatters');

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}


function registerPlaceholder(templateVariables, file, placeholder, val, json) {
    if (templateVariables[file] == null) {
        templateVariables[file] = {};
    }
    if (!json) {
        templateVariables[file][placeholder] = JSON.stringify(val);
    } else {
        templateVariables[file][placeholder] = val;
    }
    return templateVariables;
}

module.exports = {

    output: (params, callback) => {
        var src_path = path.resolve(__dirname, '../../../tasks/' + params.type);
        var substitutions = require('./substitutions')(src_path);
        var data = require('./data')(params.data);
        var tpl_path = path.join(src_path, 'templates');
        var templates = require('./templates')(params.path, tpl_path);
        var files = require('./files')(params.path, params.files);

        try {
            var templateVariables = {}
            substitutions.map(rule => {
                var value = data.get(rule.json_path);
                var copy_file = false;

                function applyValue(val, idx) {
                    var formatted_value = val;
                    if ('template' in rule) {
                        templateVariables = registerPlaceholder(templateVariables, rule.template.file, rule.template.placeholder, val, 'json' in rule.template);
                    }
                    if ('value' in rule) {
                        formatted_value = formatValue(rule.value, val, rule.json_path, idx)
                        copy_file = rule.value.type == 'file';
                    }
                    if (rule.selector) {
                        templates.inject(rule.selector, formatted_value);
                    } else if (copy_file) {
                        files.copy(val, formatted_value)
                    }
                };
                if (value instanceof Array && !('keepArray' in rule)) {
                    if (('matchingRule' in rule)) {
                        for (var i = 0; i < value.length; i++) {
                            for (var j = 0; j < rule.matchingRule.length; j++) {
                                var subRule = rule.matchingRule[j];
                                if ('template' in rule.matchingRule[j]) {
                                    templateVariables = registerPlaceholder(templateVariables, subRule.template.file, subRule.template.placeholder[i], Object.byString(value[i], subRule['jsonSubPath']), 'json' in subRule.template);
                                } else if (Object.byString(value[i], rule.matchingRule[j]['jsonSubPath']) != null) {
                                    templates.inject(rule.matchingRule[j].selector[i], Object.byString(value[i], rule.matchingRule[j]['jsonSubPath']));
                                }
                            }
                        }
                    }
                    for (var i = 0; i < value.length; i++) {
                        if (value === null) {
                            continue;
                        }
                        applyValue(value[i], i);
                    }
                } else {
                    applyValue(value);
                }
            })
            templates.injectByTemplate(templateVariables);
            templates.save();
            callback(null, {
                type: params.type,
                data: params.data,
                files: files.clear()
            });
        } catch (err) {
            callback(err);
            throw err;
        }
    }

}
