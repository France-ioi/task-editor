module.exports = function(content) {


    return {

        inject: function(selector, value) {
            content = JSON.stringify(value, null, 4);
        },

        content: function() {
            return content
        }

    }

}