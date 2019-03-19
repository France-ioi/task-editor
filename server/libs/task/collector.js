var path = require('path')
var config = require('../../config')

module.exports = function(src_path) {

    function loadFunc(collector_script) {
        var script = path.resolve(src_path, collector_script)
        if(!fs.existsSync(script)) {
            console.error('Collector script not found: ' + script)
            return function(v) {
                return v
            }
        }
        return require(script)
    }

    return {
        execute: function(collector_script, value) {
            var fn = require(path.resolve(src_path, collector_script))
            return fn(value);
        }
    }
}