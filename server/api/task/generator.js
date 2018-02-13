var fs = require('fs');
var path = require('path');

var template = require('./template')

var tpl_path = path.resolve(__dirname, '../../../task_template')



var task_data = {

    data: null,

    init: function(data) {
        this.data = data;
    },

    get: function(path) {
        var pointer = this.data;
        var nodes = path.split('.');
        var current;
        while(nodes.length) {
            current = nodes.shift();
            if(!pointer[current]) {
                console.log('Path not found: ' + path);
                return null;
            }
            pointer = pointer[current];
        }
        return pointer;
    }
}


var substitution = {


    // may be split jsonSubPath into arrays on load?
    data: require(path.resolve(tpl_path, 'substitution.json')),


    parseFileName: function(selector) {
        var file = selector.trim().match(/^\[.+\]/);
        if(file) {
            file = file.toString().replace(/\[|\]/g, '');
        }
        return file || 'index.html';
    },

    walk: function(json_path, selector_path, node) {
        if(!json_path) {
            node = this.data;
            json_path = [];
            selector_path = '';
        }

        node.map(item => {
            var item_json_path = json_path.concat(item.jsonSubPath);
            var item_selector_path = selector_path + ' ' + item.cssSelector;
            var value = task_data.get(item_json_path.join('.'));
            var filename = this.parseFileName(item_selector_path);

            if('children' in item) {
                this.walk(item_json_path, item_selector_path, item.children)
            }

            // trim filename
            var local_selector = item_selector_path.replace(/^\[.+\]/, '');
            files.inject(filename, local_selector, value)
        })
    }
}



var files = {

    templates: {},

    get: function(filename) {
        filename = filename || 'index.html';
        var ext = path.extname(filename).substr(1);
        if(!this.templates[filename]) {
            var content = fs.readFileSync(
                path.resolve(tpl_path, filename),
                { encoding: 'utf-8' }
            )
            this.templates[filename] = template.create(ext, content);
        }
        return this.templates[filename];
    },

    save: function(task_path) {
        Object.keys(this.templates).map(filename => {
            fs.writeFileSync(
                path.resolve(task_path, filename),
                this.templates[filename].content()
            );
        })
    },

    inject: function(filename, selector, value) {
        this.get(filename).inject(selector, value);
    }
}



module.exports = {

    output: (params, err) => {
        task_data.init(params.data);
        substitution.walk();
        files.save(params.path)
    }
}