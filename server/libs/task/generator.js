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
            function generate(data_path, input, output, value, data_fn, idx) {
                if(typeof value == 'undefined') {
                    try {
                        var value = data.get(data_path)
                    } catch(e) {
                        return; // Path doesn't exist
                    }
                }
                if(typeof idx == 'undefined') {
                    idx = null;
                }
                if(value instanceof Array && (!input || !input.keepArray)) {
                    value.map((v, idx) => {
                        if(v === null) { return; }
                        if(v && v.path) {
                            generate(v.path, input, output, v.value, null, idx);
                        } else {
                            generate(data_path, input, output, v, null, idx);
                        }
                    });
                    return;
                } else {
                    if(input && ('modifier' in input)) {
                        value = modifier.execute(input.modifier, value, data_path)
                    }
                    if(input && ('value' in input)) {
                        // Temporary until processMask is extracted from the files module
                        if(value instanceof Array) {
                            value = value.map((v, midx) => files.processMask(input.value, files.getRealName(v, data_path, midx), midx));
                        } else {
                            value = files.processMask(input.value, files.getRealName(value, data_path, idx), idx !== null ? idx+1 : null);
                        }
                    }
                    if(input && ('object' in input)) {
                        // Replace input by an object. Currently only supports some specific objects
                        function processValue(val, idx) {
                            var newValue = {};
                            for(attr in input.object) {
                                var curParams = input.object[attr];
                                if(curParams.input || curParams.output) {
                                    function setAttr(v) {
                                        newValue[attr] = v;
                                    }
                                    // Generate at the current path, with this attribute's generation settings
                                    generate(data_path, curParams.input, curParams.output, val, setAttr, idx);
                                } else {
                                    // Just copy the value in the schema as-is
                                    newValue[attr] = curParams;
                                }
                            }
                            return newValue;
                        }
                        value = processValue(value, idx);
                    }
                }
                if('replace' in output) {
                    // Copy value in case it's an object
                    value = JSON.parse(JSON.stringify(value));
                    if(!data_fn) {
                        data.set(data_path, value);
                    }
                } else if ('inject' in output) {
                    // Copy value in case it's an object
                    value = JSON.parse(JSON.stringify(value));
                    templates.inject(output.inject, value)
                } else if('copy' in output) {
                    files.copy(value, output.copy, data_path, idx !== null ? idx+1 : null)
                }
                if(data_fn) {
                    value = JSON.parse(JSON.stringify(value));
                    if(data_fn === true) {
                        return value;
                    } else {
                        data_fn(value);
                    }
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
