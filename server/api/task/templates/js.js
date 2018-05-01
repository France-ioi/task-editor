var templateEngine = require('mustache');

module.exports = function(content) {


    return {

        injectByTemplate: function () {
            var view = {
                title: "Joe",
                calc: function () {
                    return 2 + 4;
                }
            };
            var output = templateEngine.render("{{title}} spends {{calc}}{{#test}} hello there, this should't be printed {{/test}}", view);
            console.log(output);
            console.log("injectByTemplate called");
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