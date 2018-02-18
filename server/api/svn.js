var exec = require('child_process').exec;
var config = require('../config')

function run(cmd, req, res) {
    var dir = path.join(
        config.path,
        req.body.path
    );
    cmd = 'cd ' + dir + ' && ' + cmd;
    exec(cmd, function(err, stdout, stderr) {
        res.send({
            cmd,
            out: [stdout, stderr].join('\n')
        });
    });
}


module.exports = {

    update: (req, res) => run('svn update', req, res),
    add: (req, res) => run('svn add *', req, res),
    commit: (req, res) => run('svn commit -m "' + req.body.message.replace(/"/g, '\\"') + '"', req, res)

}