module.exports = function(content) {


    function injectVariable(variable, value) {
        var search = 'var ' + variable;
        var replace = search + ' = ' + JSON.stringify(value);
        content = content.replace(search, replace);
    }

    return {

        inject: function(selector, value) {
            if(selector.variable) {
                injectVariable(selector.variable, value)
            } else {
                content = typeof value === 'string' ? value : JSON.stringify(value)
            }
        },

        content: function() {
            return content
        }

    }

}