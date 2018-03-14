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
    }

}