var path = require('path')
var config = require('../../config')
var ejs = require('ejs')
var fs = require('fs')


var context = {}

context.helpers = {

    shuffle: function(value) {
        if(!Array.isArray(value)) {
            return value;
        }
        var i = value.length;
        var res = value.slice();
        while(i) {
            var j = Math.floor(Math.random() * i);
            var t = res[--i];
            res[i] = res[j];
            res[j] = t;
        }
        return res;
    }
}


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
            return ejs.render(content, { data: value }, { context });
        }
    }
}