var fs = require('fs');
var path = require('path');
var formatValue = require('./formatters');

Object.byString = function(o, s) {
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


module.exports = {

    output: (params, callback) => {
        var src_path = path.resolve(__dirname, '../../../tasks/' + params.type);
        var substitutions = require('./substitutions')(src_path);
        var data = require('./data')(params.data);
        var tpl_path = path.join(src_path, 'templates');
        var templates = require('./templates')(params.path, tpl_path);
        var files = require('./files')(params.path, params.files);

        try {
            substitutions.map(rule => {
                var value = data.get(rule.json_path);
                console.log("value:");
                console.log(value);
                var copy_file = false;

                function applyValue(val, idx) {
                    var formatted_value = val;
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
                if (value instanceof Array) {
                    if (('matchingRule' in rule)) {
                        for (var i = 0; i < value.length; i++) {
                            for (var j = 0; j < rule.matchingRule.length; j++) {
                                templates.inject(rule.matchingRule[j].selector[i], Object.byString(value[i], rule.matchingRule[j]['jsonSubPath']));
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
