var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var config = require('../config')
var svn = require('../libs/svn')

function readDir(req, res) {
    var dir_path = path.join(config.path, req.body.path);
    fs.readdir(dir_path, (err, files) => {
        if(err) return res.status(400).send(err);
        var list = [];
        var is_task = false;
        if(files) {
            files.map(file => {
                var fullfile = path.resolve(dir_path, file);
                try {
                    var stat = fs.statSync(fullfile);
                } catch(e) {
                    if(err) return res.status(400).send(e.message);
                }

                list.push({
                    type: stat.isDirectory() ? 'dir' : 'file',
                    name: file
                });

                if(stat.isFile() && file == config.task.data_file) {
                    is_task = true;
                }
            })
        }
        res.json({
            path: req.body.path,
            list,
            is_task
        });
    })
}


function createDir(req, res) {
    var rel_dir = path.join(req.body.path, req.body.dir);
    var abs_dir = path.join(config.path, rel_dir);
    shell.mkdir('-p', abs_dir);
    svn.commit(req.user, rel_dir, (err) => {
        if(!err) {
            return readDir(req, res);
        }
        svn.delete(req.user, rel_dir, (err) => {
            return res.status(400).send('Access denied');
        })
    })
}



function remove(req, res) {
    var abs_dir = path.join(config.path, req.body.path);
    var stat = fs.statSync(abs_dir);
    shell.rm('-rf', abs_dir);
    svn.commit(req.user, req.body.path, (err) => {
        if(!err) {
            if(stat.isDirectory()) {
                var parent_dir = req.body.path.split('/');
                parent_dir.pop();
                req.body.path = parent_dir.join('/');
            } else {
                req.body.path = path.dirname(req.body.path);
            }
            return readDir(req, res);
        }
        svn.revert(req.user, req.body.path, (err) => {
            return res.status(400).send('Access denied');
        })
    })
}


module.exports = {
    readDir,
    createDir,
    remove
}