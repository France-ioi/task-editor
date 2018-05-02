module.exports = function(content) {

    var data = JSON.parse(content);


    return {

        inject: function(selector, value) {
            if(selector.query == '') {
                data = value;
                return
            }
            var query = selector.query.split('.');
            var pointer;
            for(var i=0, prop; prop=query[i]; i++) {
                if(i == query.length - 1) {
                    if(typeof pointer == 'undefined') {
                        data[prop] = value;
                    } else {
                        pointer[prop] = value;
                    }
                } else {
                    if(!data[prop]) {
                        data[prop] = {}
                    }
                    pointer = data[prop];
                }
            }
        },

        content: function() {
            return JSON.stringify(data, null, 2);
        }

    }

}
