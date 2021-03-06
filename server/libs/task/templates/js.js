var toSource = require('tosource')


module.exports = function(content) {


    function injectVariable(variable, value) {
        var search = variable + ';';
        var replace = variable + ' = ' + toSource(value);
        content = content.replace(search, replace);
    }

    return {

        inject: function(selector, value) {
            if(selector.variable) {
                injectVariable(selector.variable, value)
            } else {
                content = typeof value === 'string' ? value : toSource(value)
            }
        },

        content: function() {
            return content
        }

    }

}