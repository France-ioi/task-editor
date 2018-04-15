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
                var formatted_value = value;
                var copy_file = false;
                if('value' in rule) {
                    formatted_value = formatValue(rule.value, value, rule.json_path)
                    copy_file = rule.value.type == 'file';
                }
                if(rule.selector) {
                    templates.inject(rule.selector, formatted_value);
                } else if(copy_file) {
                    files.copy(value, formatted_value)
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
        }
    }

}
