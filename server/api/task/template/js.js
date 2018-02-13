module.exports = function(content) {


    function formatVariable(selector) {
        return 'var ' + selector.split('$').pop();
    }

    return {

        inject: function(selector, value) {
            var search = formatVariable(selector);
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