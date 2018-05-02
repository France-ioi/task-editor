var path = require('path');
var util = require('util')

module.exports = function(src_path) {

    var filename = 'schema.json';
    var tree = require(path.resolve(src_path, filename));


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
    //console.log(util.inspect(tree, { showHidden: false, depth: null }))


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


    function processNode(node, data_path, scope, callback) {
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
                console.log(i, data_path.join('.'), scope, node_scope)
            }
        }

        if('properties' in node) {
            for(var key in node.properties) {
                var subnode_data_path = data_path.slice();
                subnode_data_path.push(key);

                processNode(
                    node.properties[key],
                    subnode_data_path,
                    node_scope,
                    callback
                )
            }
        }
    }


    return {
        walk: function(callback) {
            processNode(tree, [], {}, callback)
        }
    }

}