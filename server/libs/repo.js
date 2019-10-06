var config = require('../config')
var url = require('url')
var svn = require('./svn')
var git = require('./git')


var defaultHandler = {
    list: (config, credentials, path, callback) => {
        callback(null, ['v01/', 'git/']);
    },
    update: (config, credentials, path, callback) => { callback(); }
};


function makeBalancer(funcName, argIdx) {
    return function() {
        console.log(funcName);
        var path = arguments[argIdx];
        var args = [];

        var prefix = path.split('/')[0];
        var subPath = path.split('/').slice(1).join('/');

        if(config.repositories[prefix]) {
            var subConfig = config.repositories[prefix];
            subConfig.path = url.resolve(config.path, prefix + '/');
            var destHandler = subConfig.type == 'git' ? git : svn;
        } else {
            var subConfig = {path: config.path};
            var destHandler = defaultHandler;
        }

        args.push(subConfig);
        for(var i = 0; i < arguments.length; i++) {
            args.push(i == argIdx ? subPath : arguments[i]);
        }

        if(!destHandler[funcName]) {
            console.log('Balancer error with path `' + path + '`');
            throw 'Balancer error with path `' + path + '`';
        }
        return destHandler[funcName].apply(destHandler, args);
    };
}


var repo = {

    auth: (credentials, callback) => {
        repo.list(credentials, config.auth_path, callback);
    },

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
