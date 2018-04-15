var path = require('path')
var fs = require('fs')


var config = require('../config')

var user = require('../libs/user')
var access = require('../libs/access')
var svn = require('../libs/svn')



function auth(credentials, callback) {
    svn.list(credentials, (err, folders) => {
        if(err) return callback(err)

        var old_folders = [];
        var new_folders = folders.filter(folder => {
            var full_path = path.join(config.path, folder)
            if(fs.existsSync(full_path)) {
                old_folders.push();
                return false
            }
            return true;
        })

        svn.update(credentials, old_folders, (err) => {
            if(err) return callback(err)
            svn.checkout(credentials, new_folders, (err) => {
                if(err) return callback(err)
                access.setFolders(credentials.username, folders)
                callback(null)
            })
        });
    })

}


module.exports = {

    login: (req, res) => {
        var token = user.findToken(req.body)
        if(token) {
            return res.json({ token })
        }

        auth(req.body, (err) => {
            if(err) return res.status(400).send('User not found');
            res.json({
                token: user.add(req.body)
            })
        })
    },


    credentials: (req, res) => {
        if('token' in req.body) {
            var credentials = user.get(req.body.token)
            if(credentials) {
                return res.json(credentials);
            }
        }
        res.status(400).send('Token not found');
    }
}