var exec = require('child_process').exec
var config = require('../config')
var url = require('url')

function authParams(credentials) {
    return ' --username "' + credentials.username.replace(/"/g, '\\"') + '" ' +
        '--password "' + credentials.password.replace(/"/g, '"') + '"'
}

module.exports = {

    list: (credentials, callback) => {
        var cmd = 'svn list ' + config.svn_repository + authParams(credentials)
        exec(cmd, (err, stdout, stderr) => {
            if(stderr) {
                return callback(new Error(stderr))
            }
            var folders = stdout.replace(/\//g, '').split(/\r?\n/).filter(item => item != '')
            callback(null, folders)
        })
    },


    checkout: (credentials, folders, callback) => {
        if(!folders.length) return callback()
        folders = folders.map(folder => url.resolve(config.svn_repository, folder))
        var cmd = 'cd ' + config.path + ' && svn co ' + folders.join(' ') + ' ' + authParams(credentials)
        exec(cmd, (err, stdout, stderr) => {
            if(stderr) {
                return callback(new Error(stderr))
            }
            return callback()
        })
    }

}