var exec = require('child_process').exec;
var config = require('../config');
var path = require('path');

function run(cmd, req, res, cb) {
    var dir = path.join(
        config.path,
        req.body.path
    );
    cmd = 'cd ' + dir + ' && ' + cmd;
    exec(cmd, function(err, stdout, stderr) {
        if(cb) { cb(); }
        if(!res) { return; }
        res.send({
            cmd,
            out: [stdout, stderr].join('\n')
        });
    });
}


module.exports = {

    update: (req, res) => run(null, 'svn update', req, res),
    add: (req, res) => run('svn add --force --parents .', req, res),
    commit: (req, res) =>
        run('svn add --force --parents .', req, null,
            function () {
                run('svn commit -m "' + req.body.message.replace(/"/g, '\\"') + '"', req, res); })

}
