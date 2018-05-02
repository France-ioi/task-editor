var fs = require('fs');
var path = require('path');
var modifier = require('./modifier');

module.exports = {

    output: (params, callback) => {
        var src_path = path.resolve(__dirname, '../../../tasks/' + params.type);

        var schema = require('./schema')(src_path);
        var data = require('./data')(params.data);

        var post_processor = require('./post_processor')(params);
        var tpl_path = path.join(src_path, 'templates');
        var templates = require('./templates')(params.path, tpl_path, post_processor);

        var files = require('./files')(params.path, params.files);

        try {
            schema.walk((data_path, input, output) => {
                try {
                    var value = data.get(data_path)
                } catch(e) {
                    return; // Path doesn't exist
                }
                if(input && ('modifier' in input)) {
                    value = modifier.execute(input.modifier, value, data_path)
                }
                if(input && ('value' in input)) {
                    // Temporary until processMask is extracted from the files module
                    value = files.processMask(input.value, files.getRealName(value, data_path, null), null);
                }
                if('inject' in output) {
                    templates.inject(output.inject, value)
                } else if('copy' in output) {
                    files.copy(value, output.copy, data_path)
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
