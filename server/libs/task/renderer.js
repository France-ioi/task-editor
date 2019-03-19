var path = require('path')
var config = require('../../config')
var ejs = require('ejs')
var fs = require('fs')

module.exports = function(tpl_path) {

    function loadTemplate(template) {
        var tpl = path.resolve(tpl_path, template)
        if(!fs.existsSync(tpl)) {
            console.error('Template not found: ' + tpl);
            return '';
        }
        return fs.readFileSync(tpl, { encoding: 'utf-8' });
    }

    return {
        execute: function(options, value) {
            var content = loadTemplate(options.template)
            return ejs.render(content, { data: value })
        }
    }
}