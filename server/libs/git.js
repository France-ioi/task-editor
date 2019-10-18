var child_process_exec = require('child_process').exec
var path = require('path')
var url = require('url')

var cfg_task_importer = require('../config').task_importer
var user = require('./user')

function auth(credentials) {
    return ' --username "' + credentials.username.replace(/"/g, '\\"') + '" ' +
        '--password "' + credentials.password.replace(/"/g, '"') + '"'
}

function message(credentials) {
}

function cd(config, sub_path) {
    var full_path = sub_path ? path.resolve(config.path + '/', sub_path) : config.path;
    return 'cd "' + full_path + '" &&  ';
}


function exec(cmd, callback) {
    child_process_exec(cmd, (err, stdout, stderr) => {
        if(stderr) {
            return callback(new Error(stderr))
        }
        callback(null, stdout)
    })
}


// Insert credentials into the repository URL
function makeRepositoryUrl(config, credentials) {
    if(config.no_auth) { return config.repository; }
    var url_object = url.parse(config.repository);
    url_object.auth = (
        (config.username ? config.username : credentials.username) + ':' +
        (config.password ? config.password : credentials.password));
    return url.format(url_object);
}


var git = {

    list: (config, credentials, path, callback) => {
        git.update(config, credentials, path, (err, data) => {
            var cmd = cd(config, path) + 'ls -1F';
            exec(cmd, (err, stdout) => {
                if(err) return callback(err)
                var res = stdout.split(/\r?\n/).filter(item => item != '')
                callback(null, res)
            })
        });
    },


    checkout: (config, credentials, path, callback) => {
        git.update(config, credentials, path, callback);
    },


    update: (config, credentials, folders, callback) => {
        var cmd = cd(config) + 'git pull -q ' + makeRepositoryUrl(config, credentials);
        exec(cmd, callback)
    },


    add: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'git add ' + path
        exec(cmd, callback)
    },


    commit: (config, credentials, path, callback) => {
        git.update(config, credentials, path, (err) => {
            if(err) return callback(err)
            var cmd = cd(config) + 'git';
            if(config.commit_name) { cmd += ' -c "user.name=' + config.commit_name + '"'; }
            if(config.commit_email) { cmd += ' -c "user.email=' + config.commit_email + '"'; }
            cmd += ' commit -q';
            cmd += ' -m "Task editor commit for ' + credentials.username + '"';
            exec(cmd, (err) => {
                if(err) return callback(err)
                var cmd = cd(config) + 'git push -q ' + makeRepositoryUrl(config, credentials);
                exec(cmd, callback)
            })
        });
    },


    addCommit: (config, credentials, path, callback) => {
        git.add(config, credentials, path, (err) => {
            if(err) return callback(err)
            git.commit(config, credentials, path, callback);
        })
    },


    revert: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'git checkout -q ' + path
        exec(cmd, callback)
    },


    cleanup: (config, credentials, path, callback) => {
        git.revert(config, credentials, path, callback);
    },


    remove: (config, path, callback) => {
        var cmd = cd(config) + 'git rm -q ' + path;
        exec(cmd, callback)
    },

    removeDir: (config, credentials, path, callback) => {
        var cmd = cd(config) + 'git rm -rq ' + path;
        exec(cmd, callback)
    },

    createDir: (config, credentials, subPath, callback) => {
        var cmd = 'mkdir ' + path.resolve(config.path, subPath)
        exec(cmd, (err) => {
            if(err) return callback(err)
            git.addCommit(config, credentials, subPath, callback);
        })
    },

    getImporterUrl: (config, credentials, path) => {
        var token = config.username ? user.add({username: config.username, password: config.password}) : user.findToken(credentials);
        var params = Object.assign({
            type: 'git',
            repo: config.repository,
            path: path,
            token: token,
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

module.exports = git
