var path = require('path')
var fs = require('fs')

module.exports = function (task_path, tpl_path, post_processor) {


    var dafaults = {
        template: 'index.html'
    }

    var handlers = {
        '.html': require('./html'),
        '.js': require('./js'),
        '.json': require('./json'),
    }

    var templates = {};
    var translate = {};

    function create(ext, content) {
        if(ext in handlers) {
            return handlers[ext](content)
        }
        throw new Error('Template handler not found for extension ' + ext);
    }


    function get(file) {
        file = file || dafaults.template;
        var ext = path.extname(file);
        if(!templates[file]) {
            var content = fs.readFileSync(
                path.resolve(tpl_path, file),
                { encoding: 'utf-8' }
            )
            templates[file] = create(ext, content);
        }
        return templates[file];
    }


    function parseSelector(selector) {
        if(!selector) {
            return {
                query: ''
            }
        }
        var variable = null;
        var tmp = selector.split('$');
        if(tmp.length > 2) {
            throw new Error('Multiple variables in selector: '.full_selector);
        } if(tmp.length == 2) {
            var query = tmp[0];
            variable = tmp[1];
        } else {
            var query = selector;
        }

        return {
            query,
            variable
        }
    }

    function appendLanguageToFileName(filename, language) {
        if (!language) return filename;
        var extpos = filename.lastIndexOf('.');
        var postfix = '_' + language;
        var name = filename.substr(0, extpos);
        var ext = filename.substr(extpos);
        return name.endsWith(postfix) ? filename : (name + postfix + ext);
    }

    return {

        inject: function(destination, value) {
            var selector = parseSelector(destination.selector);
            translate[destination.template] = destination.translate === undefined ? true : destination.translate;
            get(destination.template).inject(selector, value);
        },


        save: function(language) {
            Object.keys(templates).map(filename => {
                if (language && !translate[filename]) return;
                var content = post_processor.apply(
                    templates[filename].content()
                );
                fs.writeFileSync(
                    path.resolve(task_path, appendLanguageToFileName(filename, language)),
                    content
                );
            })
        },


        reset: function() {
            templates = {};
            translate = {};
        }
    }

}
