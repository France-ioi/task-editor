var fs = require('fs');
var path = require('path');
var formatValue = require('./formatters');


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
                var copy_file = false;
                function applyValue(val, idx) {
                    var formatted_value = val;
                    if('value' in rule) {
                        formatted_value = formatValue(rule.value, val, rule.json_path, idx)
                        copy_file = rule.value.type == 'file';
                    }
                    if(rule.selector) {
                        templates.inject(rule.selector, formatted_value);
                    } else if(copy_file) {
                        files.copy(val, formatted_value)
                    }
                };
                if(value instanceof Array) {
                    for(var i=0; i<value.length; i++) {
                        if(value === null) { continue; }
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
        } catch(err) {
            callback(err);
            throw err;
        }
    }

}
