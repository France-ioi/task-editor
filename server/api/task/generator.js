var fs = require('fs');
var path = require('path');


module.exports = {

    output: (params, err) => {
        var tpl_path = path.resolve(__dirname, '../../../task_template');

        var substitutions = require('./substitutions')(tpl_path);
        var data = require('./data')(params.data);
        var templates = require('./templates')(tpl_path, params.path);
        var files = require('./files')(params.path);

        substitutions.map(rule => {
            var value = data.get(rule.json_path);
            if(rule.file) {
                files.copy(rule.file, value, rule.json_path)
            } else if(rule.selector) {
                templates.inject(rule.selector, value);
            }
        })

        templates.save();
        files.clear();
    }
}