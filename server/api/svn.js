// XXX :: This is very likely deprecated

var exec = require('child_process').exec;
var config = require('../config');
var path = require('path');
var fs = require('fs');

function run(cmd, req, res) {
    var dir = path.join(
        config.path,
        req.body.path
    );
    cmd = 'cd "' + dir + '" && ' + cmd;
    exec(cmd, function(err, stdout, stderr) {
        res.send({
            cmd,
            out: [stdout, stderr].join('\n')
        });
    });
}

function commit(cmd, req, res) {
    // Commit parent directories if needed
    var dirs = [];
    var curPath = null;
    var nextPath = req.body.path;
    while(nextPath != curPath) {
        curPath = nextPath;
        dirs.push(curPath);
        nextPath = path.dirname(curPath);
    }
    cmd = 'cd ' + config.path + ' && svn add --force --parents "' + req.body.path + '" && svn commit -m "Add newly created directories" --depth empty "' + dirs.join('" "') + '"';
    exec(cmd, function(err, stdout, stderr) {
        // Log if the command failed
        if(err) {
            console.log(['Error during commit preparation:', err.stack, stdout, stderr].join('\n'));
        }
        run('svn commit -m "' + req.body.message.replace(/"/g, '\\"') + '"', req, res);
    });
}

function pathMustExist(cmd, req, res, cb) {
    // Check path exists before executing anything else
    var dir = path.join(
        config.path,
        req.body.path
    );

    if(path.relative(config.path, dir).indexOf('..') > -1) {
        // Path must be a subpath of config.path
        res.send({
            cmd,
            out: 'Invalid path (outside of tasks folder)'
        });
        return;
    }

    fs.access(dir, function(err) {
        if(err) {
            // Path must exist
            res.send({
                cmd,
                out: 'Invalid path (path not found)'
            });
        } else {
            // Execution allowed
            cb(cmd, req, res);
        }
    });
}

module.exports = {

    update: (req, res) => pathMustExist('svn update', req, res, run),
    commit: (req, res) => pathMustExist('svn commit', req, res, commit)

}
