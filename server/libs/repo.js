var path = require('path')
var url = require('url')

var config = require('../config')
var user = require('./user')
var svn = require('./svn')
var git = require('./git')


function checkLimitUsers(credentials, subConfig) {
    return !subConfig.limit_users || subConfig.limit_users.includes(credentials.username);
}


var defaultHandler = {
    list: (repoConfig, credentials, path, callback) => {
        var accessible = [];
        for(var prefix in config.repositories) {
            subConfig = config.repositories[prefix];
            if(checkLimitUsers(credentials, subConfig)) {
                accessible.push(prefix + '/');
            }
        }
        callback(null, accessible);
    },
    update: (repoConfig, credentials, path, callback) => { callback(); }
};


function makeBalancer(funcName, pathIdx) {
    return function() {
        console.log(funcName);
        var credentials = pathIdx > 0 ? arguments[pathIdx-1] : null;
        var origPath = arguments[pathIdx];
        var args = [];

        var prefix = origPath.split('/')[0];
        var subPath = origPath.split('/').slice(1).join('/');

        if(config.repositories[prefix]) {
            var subConfig = config.repositories[prefix];
            subConfig.path = path.resolve(config.path, prefix + '/');
            var destHandler = subConfig.type == 'git' ? git : svn;
        } else {
            var subConfig = {path: config.path};
            var destHandler = defaultHandler;
        }

        if(credentials && !checkLimitUsers(credentials, subConfig)) {
            console.log('Unauthorized user for action ' + funcName + ' on path `' + origPath + '`');
            throw 'Unauthorized user for action ' + funcName + ' on path `' + origPath + '`';
        }

        args.push(subConfig);
        for(var i = 0; i < arguments.length; i++) {
            args.push(i == pathIdx ? subPath : arguments[i]);
        }

        if(!destHandler[funcName]) {
            console.log('Balancer error with path `' + origPath + '`');
            throw 'Balancer error with path `' + origPath + '`';
        }
        return destHandler[funcName].apply(destHandler, args);
    };
}


function getImporterUrl(credentials, path) {
    var params = Object.assign({
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
    return config.task_importer.url + '?' + q.join('&');
};


var repo = {

    auth: (credentials, callback) => {
        repo.list(credentials, config.auth_path, callback);
    },

    getReverseTaskPath: (taskPath) => {
        // Get a repository relative path to a task
        // (used for generating path to _common)
        var subPath = path.relative(config.path, taskPath);
        var prefix = subPath.split('/')[0];
        if(config.repositories[prefix]) {
            return path.relative(taskPath, path.resolve(config.path, prefix + '/'));
        } else {
            return path.relative(taskPath, config.path);
        }
    },

    getImporterUrl: makeBalancer('getImporterUrl', 1),
    list: makeBalancer('list', 1),
    checkout: makeBalancer('checkout', 1),
    update: makeBalancer('update', 1),
    add: makeBalancer('add', 1),
    commit: makeBalancer('commit', 1),
    addCommit: makeBalancer('addCommit', 1),
    revert: makeBalancer('revert', 1),
    cleanup: makeBalancer('cleanup', 1),
    remove: makeBalancer('remove', 0),
    removeDir: makeBalancer('removeDir', 1),
    createDir: makeBalancer('createDir', 1)

}

module.exports = repo
