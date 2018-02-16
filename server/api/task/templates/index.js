var path = require('path')

module.exports = function(tpl_path, task_path) {


    var dafaults = {
        template: 'index.html'
    }

    var handlers = {
        'html': require('./html'),
        'js': require('./js')
    }

    var templates = {};

    function create(ext, content) {
        if(ext in handlers) {
            return handlers[ext](content)
        }
        throw new Error('Template handler not found for extension ' + ext);
    }


    function get(filename) {
        filename = filename || dafaults.template;
        var ext = path.extname(filename).substr(1);
        if(!templates[filename]) {
            var content = fs.readFileSync(
                path.resolve(tpl_path, filename),
                { encoding: 'utf-8' }
            )
            templates[filename] = template.create(ext, content);
        }
        return templates[filename];
    }


    function parseSelector(full_selector) {
        var file = full_selector.trim().match(/^\[.+\]/);
        if(file) {
            file = file.toString().replace(/\[|\]/g, '');
        }
        var selector = selector.replace(/^\[.+\]/, '');
        return {
            file,
            selector
        }
    }


    return {

        inject: function(full_selector, value) {
            var p = parseSelector(full_selector);
            get(p.filename).inject(p.selector, value);
        },


        save: function() {
            Object.keys(templates).map(filename => {
                fs.writeFileSync(
                    path.resolve(task_path, filename),
                    templates[filename].content()
                );
            })
        }
    }

}