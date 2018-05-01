var path = require('path')
var fs = require('fs')

module.exports = function (task_path, tpl_path) {


    var dafaults = {
        template: 'index.html'
    }

    var handlers = {
        '.html': require('./html'),
        '.js': require('./js'),
        '.json': require('./json'),
    }

    var templates = {};

    function create(ext, content) {
        if (ext in handlers) {
            return handlers[ext](content)
        }
        throw new Error('Template handler not found for extension ' + ext);
    }


    function get(file) {
        file = file || dafaults.template;
        var ext = path.extname(file);
        if (!templates[file]) {
            var content = fs.readFileSync(
                path.resolve(tpl_path, file),
                {encoding: 'utf-8'}
            )
            templates[file] = create(ext, content);
        }
        return templates[file];
    }


    function parseSelector(full_selector) {
        var file = full_selector.trim().match(/^\[.+\]/);
        if (file) {
            file = file.toString();
            var selector = full_selector.substr(file.length);
            file = file.replace(/\[|\]/g, '');
        } else {
            var selector = full_selector;
        }

        var variable = null;
        var tmp = selector.split('$');
        if (tmp.length > 2) {
            throw new Error('Multiple variables in selector: '.full_selector);
        }
        if (tmp.length == 2) {
            var query = tmp[0];
            variable = tmp[1];
        } else {
            var query = selector;
        }

        // check if selector refers to a file + variable e.g. [filename$variable]
        if (file) {
            var dollarCharIndex = file.indexOf('$');
            if (dollarCharIndex > 0) {
                variable = file.substring(dollarCharIndex + 1, file.length);
                file = file.substring(0, dollarCharIndex != -1 ? dollarCharIndex : file.length);
            }
        }
        return {
            file,
            selector: {
                query,
                variable
            }
        }
    }


    return {

        injectByTemplate: function (full_selector, value) {
            var p = parseSelector(full_selector);
            get(p.file).injectByTemplate(p.selector, value);
        },

        inject: function (full_selector, value) {
            var p = parseSelector(full_selector);
            get(p.file).inject(p.selector, value);
        },


        save: function () {
            Object.keys(templates).map(filename => {
                fs.writeFileSync(
                    path.resolve(task_path, filename),
                    templates[filename].content()
                );
            })
        }
    }

}