var path = require('path')

var templates = {
    'html': require('./html'),
    'js': require('./js')
}

module.exports = {

    create: function(ext, content) {
        if(ext in templates) {
            return templates[ext](content)
        }
        return null;
    }
}