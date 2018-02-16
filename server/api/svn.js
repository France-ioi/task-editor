var exec = require('child_process').exec;


function run(cmd, req, res) {
    cmd = 'cd ' + req.body.path + ' && ' + cmd;
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