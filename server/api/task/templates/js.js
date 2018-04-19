module.exports = function(content) {


    return {

        // replace {{ variable }} by value
        inject: function(selector, value) {
            if(!selector.variable) return;
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