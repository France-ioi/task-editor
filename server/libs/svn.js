var child_process_exec = require('child_process').exec
var url = require('url')

var cfg_task_importer = require('../config').task_importer
var user = require('./user')
var fs = require('fs');

function auth(credentials) {
    return ' --username "' + credentials.username.replace(/"/g, '\\"') + '" ' +
        '--password "' + credentials.password.replace(/"/g, '"') + '"'
}

function message() {
    return ' --message "Task editor"'
}

function cd(config, force_create_dir) {
    if(force_create_dir && !fs.existsSync(config.path)) {
        fs.mkdirSync(config.path);
    }
    return 'cd "' + config.path + '" &&  ';
}


function exec(cmd, callback) {
    child_process_exec(cmd, (err, stdout, stderr) => {
        if(stderr) {
            return callback(new Error(stderr))
        }
        callback(null, stdout)
    })
}


var svn = {

    list: (config, credentials, path, callback) => {
        console.log(
            config.repository,
            path,
            url.resolve(config.repository, path)
        )
        var cmd = 'svn list ' + url.resolve(config.repository, path) + auth(credentials)
        exec(cmd, (err, stdout) => {
            if(err) return callback(err)
            var res = stdout.split(/\r?\n/).filter(item => item != '')
            callback(null, res)
        })
    },


    checkout: (config, credentials, path, callback) => {
        var cmd = cd(config, true) + 'svn co ' + url.resolve(config.repository, path) + ' ' + path + ' ' + auth(credentials)
        exec(cmd, callback)
    },


    update: (config, credentials, folders, callback) => {
        if(!folders && !folders.length) return callback()
        if(!Array.isArray(folders)) {
            folders = [folders]
        }
        var cmd = cd(config) + 'svn update ' + folders.join(' ') + auth(credentials)
        exec(cmd, callback)
    },


    add: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'svn add ' + path + ' --force'
        exec(cmd, callback)
    },


    commit: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'svn commit ' + path + auth(credentials) + message()
        exec(cmd, callback)
    },


    addCommit: (config, credentials, path, callback) => {
        svn.add(config, credentials, path, (err) => {
            if(err) {
                return svn.revert(config, credentials, path, (err2) => {
                    callback(err || err2)
                })
            }
            svn.commit(config, credentials, path, (err) => {
                if(err) return callback(err)
                svn.update(config, credentials, path, callback)
            })
        })
    },


    revert: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'svn revert ' + path
        exec(cmd, callback)
    },


    cleanup: (config, credentials, path, callback) => {
        var cmd = cd(config) +
            'svn status ' + path +
            ' --no-ignore | grep \'^[I?]\' | cut -c 9- | while IFS= read -r f; do rm -rf "$f"; done';
        exec(cmd, callback)
    },


    remove: (config, path, callback) => {
        var cmd = 'svn rm ' + path;
        exec(cmd, callback)
    },

    removeDir: (config, credentials, path, callback) => {
        var cmd = 'svn rm ' + config.repository + path + auth(credentials) + message()
        exec(cmd, callback)
    },

    createDir: (config, credentials, path, callback) => {
        var cmd = 'svn mkdir ' + config.repository + path + auth(credentials) + message()
        exec(cmd, callback)
    },

    getImporterUrl: (config, credentials, path) => {
        var params = Object.assign({
            type: 'svn',
            path: path,
            token: user.findToken(credentials),
            display: 'frame',
            autostart: 1
        }, config.task_importer_params);
        var q = [];
        for(var k in params) {
            if(params.hasOwnProperty(k)) {
                q.push(k + '=' + encodeURIComponent(params[k]));
            }
        }
        return cfg_task_importer.url + '?' + q.join('&');
    }
}

module.exports = svn
