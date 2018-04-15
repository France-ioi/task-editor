// old code, need update
/*
var path = require('path');
var generator = require('./libs/task/generator')

var params = {
    data: require('../task_output/task_content.json'),
    path: path.resolve(__dirname, '../task_output')
}

generator.output(params, err => console.error(err.message));
*/


/*

var exec = require('child_process').exec;
var path = require('path');



cmd = 'svn list svn://svn.france-ioi.org/tasks/v01 --username 123123 --password 123123';
exec(cmd, (err, stdout, stderr) => {
    console.log(stderr);
    if(stdout) {
        var dirs = stdout.split(/\r?\n/).filter(item => item != '');
        console.log(dirs)
    }
//    console.log('stdout', stdout, 'stderr', stderr)
});
*/