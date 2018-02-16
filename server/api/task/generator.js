var fs = require('fs');
var path = require('path');



var substitution_data = {


    // may be split jsonSubPath into arrays on load?
    run: function(data) {
        this.data = data;
        this.walk();
    },
    //data: require(path.resolve(tpl_path, 'substitution.json')),


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
            templates.inject(filename, local_selector, value)
        })
    }
}





module.exports = {

    output: (params, err) => {
        var tpl_path = path.resolve(__dirname, '../../../task_template');

        var substitutions = require('./substitutions')(tpl_path);
        var data = require('./data')(params.data);
        var templates = require('./templates')(tpl_path, params.path);
        var files = require('./files')(params.path);

        substitutions.map(rule => {
            var value = data.get(rule.json_path);
            if(rule.file) {
                files.copy(rule.file, value, rule.json_path)
            } else if(rule.selector) {
                //templates.inject(selector, value);
            }
        })

        templates.save();
        files.clear();
    }
}