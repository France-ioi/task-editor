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


function imageFileLocation(task_subpath, filename) {
    return path.join(
        config.url_prefix,
        task_subpath,
        config.task.images_dir,
        filename
    )
}


function searchImages(task_subpath) {
    var extensions = ['.png', '.gif', '.jpg', '.jpeg'];
    var res = [];

    function scanDir(dir) {
        fs.readdirSync(dir).map(file => {
            var filepath = path.join(dir, file);
            var stat = fs.statSync(filepath);
            if(stat.isFile(filepath)) {
                if(extensions.indexOf(path.extname(file)) !== -1) {
                    var url = path.join(
                        config.url_prefix,
                        path.relative(config.path, filepath)
                    );
                    res.push({
                        title: file,
                        value: url
                    })
                }
            } else if(stat.isDirectory(filepath)) {
                scanDir(filepath);
            }
        })
    }
    scanDir(
        path.join(config.path, task_subpath)
    );
    return res;
}

module.exports = {

    upload: (req, res) => {
        if(!req.files && !req.files.file) {
            return res.status(400).send('File not uploaded');
        }
        req.files.file.mv(
            imageFilePath(req.body.path, req.files.file.name),
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    location: imageFileLocation(req.body.path, req.files.file.name)
                });
            }
        );
    },


    search: (req, res) => {
        res.json(
            searchImages(req.body.path)
        );
    }

}