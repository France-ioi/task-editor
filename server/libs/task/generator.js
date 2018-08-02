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
            function generate(data_path, input, output) {
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
                if('replace' in output) {
                    // Copy value in case it's an object
                    value = JSON.parse(JSON.stringify(value));
                    data.set(data_path, value);
                } else if ('inject' in output) {
                    // Copy value in case it's an object
                    value = JSON.parse(JSON.stringify(value));
                    templates.inject(output.inject, value)
                } else if('copy' in output) {
                    files.copy(value, output.copy, data_path)
                }
            }
            var generators = [];
            schema.walk((data_path, input, output) => {
                if(input && ('step' in input)) {
                    // Generate later
                    // TODO :: support multiple steps
                    generators.push({
                        data_path: data_path,
                        input: input,
                        output: output});
                } else {
                    generate(data_path, input, output);
                }
            });
            // Apply delayed generators
            generators.forEach((g) => {
                generate(g.data_path, g.input, g.output);
            });
            templates.save();
            files.clear((new_files) => {
                callback(null, {
                    type: params.type,
                    data: params.data,
                    files: new_files
                    });
                });
        } catch(err) {
            callback(err);
        }
    }

}
