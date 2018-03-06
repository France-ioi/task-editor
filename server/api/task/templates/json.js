module.exports = function(content) {

    var data = JSON.parse(content);


    return {

        inject: function(selector, value) {
            var query = selector.query.split('.');
            var pointer;
            for(var i=0; i<query.length; i++) {
                if(i == query.length - 1) {
                    if(typeof pointer == 'undefined') {
                        data[query[i]] = value;
                    } else {
                        pointer[query[i]] = value;
                    }
                } else {
                    pointer = data[query[i]];
                }
            }
        },

        content: function() {
            return JSON.stringify(data, null, 4);
        }

    }

}