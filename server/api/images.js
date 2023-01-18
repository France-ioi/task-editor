var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var config = require('../config')


function imageFilePath(task_subpath, filename) {
    var filepath = path.join(
        config.path,
        task_subpath,
        config.task.images_dir
    );
    shell.mkdir('-p', filepath);
    return path.join(filepath, filename);
}


function searchImages(task_subpath) {
    var extensions = ['.png', '.gif', '.jpg', '.jpeg'];
    var res = [];
    var task_path = path.join(config.path, task_subpath);

    function scanDir(dir) {
        fs.readdirSync(dir).map(file => {
            if(file == config.task.tmp_dir) return;
            var filepath = path.join(dir, file);
            var stat = fs.statSync(filepath);
            if(stat.isFile(filepath)) {
                if(extensions.indexOf(path.extname(file)) !== -1) {
                    res.push({
                        title: file,
                        value: path.relative(task_path, filepath)
                    });
                }
            } else if(stat.isDirectory(filepath)) {
                scanDir(filepath);
            }
        })
    }
    scanDir(task_path);
    return res;
}

module.exports = {

    upload: (req, res) => {
        if(!req.files && !req.files.file) {
            return res.status(400).send('File not uploaded');
        }
        req.files.file.mv(
            imageFilePath(req.auth.session, req.files.file.name),
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    location: path.join(config.task.images_dir, req.files.file.name)
                });
            }
        );
    },




    search: (req, res) => {
        res.json(
            searchImages(req.auth.session)
        );
    }

}