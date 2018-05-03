var child_process_exec = require('child_process').exec
var config = require('../config')
var url = require('url')

function auth(credentials) {
    return ' --username "' + credentials.username.replace(/"/g, '\\"') + '" ' +
        '--password "' + credentials.password.replace(/"/g, '"') + '"'
}

function message() {
    return ' --message "Task editor"'
}

function cd() {
    return 'cd "' + config.path + '" &&  ';
}


function exec(cmd, callback) {
    child_process_exec(cmd, (err, stdout, stderr) => {
        if(config.dev.log) {
            console.log(cmd)
            stderr && console.error(stderr)
            stdout && console.error(stdout)
        }
        if(stderr) {
            return callback(new Error(stderr))
        }
        callback(null, stdout)
    })
}


var svn = {

    list: (credentials, path, callback) => {
        var cmd = 'svn list ' + url.resolve(config.svn_repository, path) + auth(credentials)
        exec(cmd, (err, stdout) => {
            if(err) return callback(err)
            var res = stdout.split(/\r?\n/).filter(item => item != '')
            callback(null, res)
        })
    },


    checkout: (credentials, path, callback) => {
        var cmd = cd() + 'svn co ' + url.resolve(config.svn_repository, path) + ' ' + path + ' ' + auth(credentials)
        exec(cmd, callback)
    },


    update: (credentials, folders, callback) => {
        if(!folders && !folders.length) return callback()
        if(!Array.isArray(folders)) {
            folders = [folders]
        }
        var cmd = cd() + 'svn update ' + folders.join(' ') + auth(credentials)
        exec(cmd, callback)
    },


    add: (credentials, path, callback) => {
        var cmd = cd() + 'svn add ' + path + ' --force'
        exec(cmd, callback)
    },


    commit: (credentials, path, callback) => {
        var cmd = cd() + 'svn commit ' + path + auth(credentials) + message()
        exec(cmd, callback)
    },


    addCommit: (credentials, path, callback) => {
        svn.add(credentials, path, (err) => {
            if(err) {
                return svn.revert(credentials, path, (err2) => {
                    callback(err || err2)
                })
            }
            svn.commit(credentials, path, (err) => {
                if(err) return callback(err)
                svn.update(credentials, path, callback)
            })
        })
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
    },


    remove: (path, callback) => {
        var cmd = 'svn rm ' + path;
        exec(cmd, callback)
    },

    removeDir: (credentials, path, callback) => {
        var cmd = 'svn rm ' + config.svn_repository + path + auth(credentials) + message()
        exec(cmd, callback)
    },

    createDir: (credentials, path, callback) => {
        var cmd = 'svn mkdir ' + config.svn_repository + path + auth(credentials) + message()
        exec(cmd, callback)
    }

}

module.exports = svn
