var fs = require('fs');
var path = require('path');


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
                if(rule.file) {
                    files.copy(rule.file, value, rule.json_path)
                } else if(rule.selector) {
                    templates.inject(rule.selector, value);
                }
            })

            templates.save();
            var new_files = files.clear();
            callback(null, {
                type: params.type,
                data: params.data,
                files: new_files
            });
        } catch(err) {
            callback(err);
        }
    }

}