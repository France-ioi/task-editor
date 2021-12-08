var storage_key = 'JSON_EDITOR_VALUES_CACHE';
var storage = window.localStorage;
var data = {}


function save() {
    storage && storage.setItem(storage_key, JSON.stringify(data))
}

if(storage) {
    try {
        data = storage.getItem(storage_key);
        data = JSON.parse(data) || {};
    } catch(e) {
        data = {}
        save();
    }
}

module.exports = {

    get: function(key) {
        return key in data ? data[key] : null;
    },

    set: function(key, value) {
        data[key] = value;        
        save();
    }

}