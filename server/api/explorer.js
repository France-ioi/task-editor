var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var config = require('../config')

function readDir(req, res) {
    var dir_path = path.join(config.path, req.body.path);
    fs.readdir(dir_path, (err, files) => {
        if(err) return res.status(400).send(err);
        var list = [];
        if(files) {
            files.map(file => {
                var fullfile = path.resolve(dir_path, file);
                try {
                    var stat = fs.statSync(fullfile);
                } catch(e) {
                    if(err) return res.status(400).send(e.message);
                }
                if((req.body.folders && stat.isDirectory()) || (req.body.files && stat.isFile())) {
                    list.push(file)
                };
            })
        }
        res.json({
            path: req.body.path,
            list
        });
    })
}


function createDir(req, res) {
    var new_dir = path.join(
        config.path,
        req.body.path,
        req.body.dir
    );
    shell.mkdir('-p', new_dir);
    readDir(req, res);
}


function removeDir(req, res) {
    var dir = path.join(config.path, req.body.path)
    shell.rm('-rf', dir);
    var parent_dir = req.body.path.split('/');
    parent_dir.pop();
    req.body.path = parent_dir.join('/');
    readDir(req, res);
}


module.exports = {
    readDir,
    createDir,
    removeDir
}