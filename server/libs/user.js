var uuidv1 = require('uuid/v1');
var config = require('../config')

var data = {};

function generateToken() {
    var token;
    do {
        token = uuidv1();
    } while (token in data);
    return token;
}


module.exports = {


    findToken: function(credentials) {
        for(var token in data) {
            if(data[token].username == credentials.username && data[token].password == credentials.password) {
                return token;
            }
        }
        return false;
    },


    add: function(credentials) {
        var token = generateToken();
        data[token] = {
            username: credentials.username,
            password: credentials.password
        }
        return token;
    },


    get: function(token) {
        return data[token]
    },


    remove: function(token) {
        delete data[token];
    }

}