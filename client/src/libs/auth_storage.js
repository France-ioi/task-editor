var key = 'AUTH';
var storage = window.localStorage;

module.exports = {

    get: function() {
        if(storage) {
            var data = storage.getItem(key);
            if(data) {
                return JSON.parse(data);
            }
        }
        return null;
    },


    set: function(data) {
        if(!storage) return;
        storage.setItem(
            key,
            JSON.stringify(data)
        )
    },


    clear: function() {
        storage && storage.removeItem(key);
    }
}