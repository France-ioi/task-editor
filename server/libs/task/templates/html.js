var cheerio = require('cheerio')


module.exports = function(content) {

    var $ = cheerio.load(content)

    function injectVariable(selector, value) {
        var search = 'var ' + selector.variable;
        var replace = search + ' = ' + JSON.stringify(value);

        if(selector.query) {
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

    function toString(value) {
        if(typeof value === 'object' && '__type' in value) {
            switch(value.__type) {
                case 'html':
                    return value.__value;
                    break;
                case 'markdown':
                    return '<div class="markdown">\n' + value.__value + '\n</div>'
                    break;
                default:
                    return value.__value;
            }
        }
        return value
    }

    return {

        inject: function(selector, value) {
            value = toString(value)
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
