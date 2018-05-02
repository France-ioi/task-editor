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

    return {

        inject: function(destination, value) {
            var selector = parseSelector(destination.selector);
            get(destination.template).inject(selector, value);
        },


        save: function() {
            Object.keys(templates).map(filename => {
                var content = post_processor.apply(
                    templates[filename].content()
                );
                fs.writeFileSync(
                    path.resolve(task_path, filename),
                    content
                );
            })
        }
    }

}