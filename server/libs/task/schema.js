var schema_loader = require('../schema_loader.js')

function validateSchema(data, schema) {
    if (schema.type === 'object') {
        if (!(data instanceof Object)) {
            return false;
        }
        for (let key in schema.properties) {
            if (!(key in data)) {
                return false;
            }
            if (!validateSchema(data[key], schema.properties[key])) {
                return false;
            }
        }

        return true;
    }

    if (schema.type === 'array') {
        if (!Array.isArray(data)) {
            return false;
        }

        for (let i = 0; i < data.length; i++) {
            if (!validateSchema(data[i], schema.items)) {
                return false;
            }
        }

        return true;
    }

    return typeof data === schema.type;
}

module.exports = function(src_path) {

    var tree = schema_loader.load(src_path);

    // expand tree using $ref
    // only #/defintinions path supported for now
    function expandRefs(node) {
        if(!!node && (typeof node === 'object')) {
            if('$ref' in node) {
                var def_key = node['$ref'].replace('#/definitions/', '')
                if(def_key in tree.definitions) {
                    Object.assign(node, tree.definitions[def_key])
                }
                delete node['$ref']
            }
            for(var k in node) {
                expandRefs(node[k])
            }
        }
    }

    expandRefs(tree)


    function testCondition(condition, scope) {
        if(!condition) return true;
        for(var k in condition) {
            if(condition[k] === null && k in scope) return false;
            if(condition[k] !== scope[k]) return false;
        }
        return true;
    }


    function injectScope(str, scope) {
        return str.replace(/\[\w+\]/g, function (placeholder) {
            var key = placeholder.replace(/\[|\]/g, '')
            return scope[key] || placeholder
        })
    }


    function formatOutput(output, scope) {
        function walkObj(obj) {
            var res = {}
            for(var k in obj) {
                if(typeof obj[k] == 'string') {
                    res[k] = injectScope(obj[k], scope)
                } else if(typeof obj[k] == 'object') {
                    res[k] = walkObj(obj[k])
                } else {
                    res[k] = obj[k]
                }
            }
            return res;
        }
        return walkObj(output)
    }


    function processNode(node, data_path, scope, data, callback) {
        var node_scope = Object.assign({}, scope)
        if (node.generator) {
            for(var i=0, rule; rule=node.generator[i]; i++) {
                if(!testCondition(rule.condition, node_scope)) continue
                if(rule.scope) {
                    node_scope = Object.assign(node_scope, rule.scope)
                }
                if(rule.output) {
                    callback(
                        data_path,
                        rule.input,
                        formatOutput(rule.output, node_scope)
                    )
                }
            }
        }

        var subNodes = null;
        if('properties' in node) { subNodes = node.properties; }
        if('items' in node) {
            if(node.items.type == 'object') {
                subNodes = node.items.properties;
            } else {
                processNode(
                    node.items,
                    data_path,
                    node_scope,
                    data,
                    callback
                )
                return;
            }
        }
        if ('oneOf' in node) {
            // Determine which type is the oneOf based on data
            var inherentDataValue = null;
            try {
                inherentDataValue = data.get(data_path);
            } catch (e) {
                // If the inherent data does not exist
                return;
            }

            if (Array.isArray(inherentDataValue)) {
                inherentDataValue = inherentDataValue[0];
            }
            if (!inherentDataValue) {
                return;
            }
            if (inherentDataValue.path && inherentDataValue.value) {
                inherentDataValue = inherentDataValue.value;
            }

            for (var oneOfTypeIndex = 0; oneOfTypeIndex < node.oneOf.length; oneOfTypeIndex++) {
                var oneOfType = node.oneOf[oneOfTypeIndex];
                if (validateSchema(inherentDataValue, oneOfType)) {
                    processNode(
                        oneOfType,
                        data_path,
                        node_scope,
                        data,
                        callback
                    );
                    return;
                }
            }

        }
        if(subNodes) {
            for(var key in subNodes) {
                var subnode_data_path = data_path.slice();
                subnode_data_path.push(key);

                processNode(
                    subNodes[key],
                    subnode_data_path,
                    node_scope,
                    data,
                    callback
                )
            }
        }
    }


    return {
        walk: function(language, data, callback) {
            processNode(tree, [], { language }, data, callback)
        },
        getTranslations: function() {
            if (tree.languages) {
                var languages = Object.keys(tree.languages.list);
                return languages.filter(lang => lang !== tree.languages.original);
            } else {
                return []
            }
        },
        isRTL: function(language) {
            if (tree.languages && Array.isArray(tree.languages.rtl)) {
                return tree.languages.rtl.indexOf(language) > -1;
            } else {
                return false;
            }
        }
    }

}
