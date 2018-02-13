var cheerio = require('cheerio')


module.exports = function(content) {


    var $ = cheerio.load(content)


    function injectVariable(variable, value) {
        var search = 'var ' + variable;
        var replace = search + ' = ' + JSON.stringify(value);
        $('script').map((i, el) => {
            el = $(el)
            el.html(el.html().replace(search, replace))
        })
    }

    function injectElement(selector, value) {
        var el = $(selector);
        if(value instanceof Array) {
            value.map(item => {
                el.before(
                    el.clone().html(value.toString())
                );
            })
            el.remove();
        } else {
            el.html(value.toString());
        }
    }

    return {

        inject: function(selector, value) {
            if(/\$/.test(selector)) {
                var name = selector.split('$').pop();
                injectVariable(name, value)
            } else {
                injectElement(selector, value)
            }
        },

        content: function() {
            return $.html()
        }

    }

}