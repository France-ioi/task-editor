var auth_key = 'AUTH';
var app_id_key = 'APP_INSTANCE_ID';
var storage = window.localStorage;

module.exports = {

    get: function() {
        if(storage) {
            if(window.__APP_INSTANCE_ID__ != storage.getItem(app_id_key)) {
                this.clear();
                return null;
            }
            var data = storage.getItem(auth_key);
            if(data) {
                return JSON.parse(data);
            }
        }
        return null;
    },


    set: function(data) {
        if(!storage) return;
        storage.setItem(app_id_key, window.__APP_INSTANCE_ID__);
        storage.setItem(auth_key, JSON.stringify(data))
    },


    clear: function() {
        storage && storage.removeItem(auth_key);
    }
}