module.exports = function(content) {


    function formatVariable(variable) {
        return 'var ' + variable;
    }

    return {

        inject: function(selector, value) {
            if(!selector.variable) return;
            var search = formatVariable(selector.variable);
            if(search) {
                var replace = search + ' = ' + JSON.stringify(value);
                content = content.replace(search, replace);
            }
        },

        content: function() {
            return content
        }

    }

}