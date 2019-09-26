var config = require('../config');
var path = require('path');

function requireModule(module) {
    if (config.dev.debug) {
        delete require.cache[require.resolve(module)];
    }
    return require(module);
}

module.exports = {
    load: function(src_path) {
        var filename = "schema/index.js";
        filename = path.resolve(src_path, filename);
        return requireModule(filename);
    }
};
