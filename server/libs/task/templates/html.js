var cheerio = require('cheerio')


module.exports = function(content) {


    var $ = cheerio.load(content)


    function injectVariable(selector, value) {
        if(!selector.variable) return;
        var search = 'var ' + selector.variable;
        var replace = search + ' = ' + JSON.stringify(value);


        if(selector.query) {
            //var elements = $(selector.query).find('script');
            var elements = $(selector.query);
            if(elements[0] && elements[0].type !== "script") {
                elements = elements.find('script')
            }
        } else {
            var elements = $('script');
        }
        elements.map((i, el) => {
            el = $(el)
            el.html(el.html().replace(search, replace))
        })
    }

    function injectElement(selector, value) {
        if(!selector.query) return;
        var el = $(selector.query);
        if(value instanceof Array) {
            value.map(item => {
                el.before(
                    el.clone().html(item.toString())
                );
            })
            el.remove();
        } else {
            el.html(value.toString());
        }
    }

    return {

        inject: function(selector, value) {
            if(selector.variable) {
                injectVariable(selector, value)
            } else {
                injectElement(selector, value)
            }
        },

        content: function() {
            return $.html()
        }

    }

}
