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

function addUser(credentials) {
    var token = generateToken();
    data[token] = {
        username: credentials.username,
        password: credentials.password
    }
    return token;
}

function findToken(credentials) {
    for(var token in data) {
        if(data[token].username == credentials.username && data[token].password == credentials.password) {
            return token;
        }
    }
    return false;
}


function auth(credentials) {
    if(credentials.username == config.dev.username && credentials.password == config.dev.password) {
        return true;
    }
    //TODO: svn
    return false;
}



module.exports = {

    login: (req, res) => {
        var token = findToken(req.body);
        if(!token) {
            if(!auth(req.body)) {
                return res.status(400).send('User not found');
            }
            token = addUser(req.body);
        }
        res.json({ token })
    },


    credentials: (req, res) => {
        if('token' in req.body && req.body.token in data) {
            return res.json(data[req.body.token]);
        }
        res.status(400).send('Token not found');
    }
}