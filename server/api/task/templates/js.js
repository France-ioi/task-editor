var templateEngine = require('mustache');

module.exports = function(content) {


    return {

        injectByTemplate: function (templatesVariables) {
            content = templateEngine.render(content, templatesVariables);
        },
        // replace {{ variable }} by value
        inject: function(selector, value) {
            if(!selector.variable || selector.variable == null) return;
            var search = "{{" + selector.variable + "}}";
            if(search) {
                content = content.replace(search, JSON.stringify(value));
            }
        },

        content: function() {
            return content
        }

    }

}