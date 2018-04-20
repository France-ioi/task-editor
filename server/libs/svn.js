var child_process_exec = require('child_process').exec
var config = require('../config')
var url = require('url')

function auth(credentials) {
    return ' --username "' + credentials.username.replace(/"/g, '\\"') + '" ' +
        '--password "' + credentials.password.replace(/"/g, '"') + '"'
}


function cd() {
    return 'cd "' + config.path + '" &&  ';
}


function exec(cmd, callback) {
    child_process_exec(cmd, (err, stdout, stderr) => {
        console.log(cmd)
        stderr && console.error(stderr)
        stdout && console.error(stdout)
        if(stderr) {
            return callback(new Error(stderr))
        }
        callback(null, stdout)
    })
}


module.exports = {

    list: (credentials, callback) => {
        var cmd = 'svn list ' + config.svn_repository + auth(credentials)
        exec(cmd, (err, stdout) => {
            if(err) return callback(err)
            var folders = stdout.replace(/\//g, '').split(/\r?\n/).filter(item => item != '')
            callback(null, folders)
        })
    },


    checkout: (credentials, folders, callback) => {
        if(!folders.length) return callback()
        folders = folders.map(folder => url.resolve(config.svn_repository, folder))
        var cmd = cd() + 'svn co ' + folders.join(' ') + ' ' + auth(credentials)
        exec(cmd, callback)
    },


    update: (credentials, folders, callback) => {
        if(!folders && !folders.length) return callback()
        if(!Array.isArray(folders)) {
            folders = [folders]
        }
        var cmd = cd() + 'svn update ' + folders.join(' ') + ' ' + auth(credentials)
        exec(cmd, callback)
    },


    add: (credentials, path, callback) => {
        var cmd = cd() + 'svn add ' + path + ' --force'
        exec(cmd, callback)
    },


    commit: (credentials, path, callback) => {
        var cmd = cd() + 'svn commit ' + path + ' ' + auth(credentials) + ' --message "Task editor"'
        exec(cmd, callback)
    },


    delete: (credentials, path, callback) => {
        var cmd = cd() + 'svn rm ' + path
        exec(cmd, callback)
    },


    revert: (credentials, path, callback) => {
        var cmd = cd() + 'svn revert ' + path
        exec(cmd, callback)
    },


    cleanup: (credentials, path, callback) => {
        var cmd = cd() +
            'svn status ' + path +
            ' --no-ignore | grep \'^[I?]\' | cut -c 9- | while IFS= read -r f; do rm -rf "$f"; done';
        exec(cmd, callback)
    }

}