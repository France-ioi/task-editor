var fs = require('fs');
var is_binary_file = require('isbinaryfile').isBinaryFileSync;
var path = require('path');
var shell = require('shelljs');
var config = require('../config')


function taskFilePath(task_subpath, filename) {
    var filepath = path.join(
        config.path,
        task_subpath,
        config.task.tmp_dir
    );
    shell.mkdir('-p', filepath);
    return path.join(filepath, filename);
}


module.exports = {

    upload: (req, res) => {
        if(!req.files) {
            return res.status(400).send('File not uploaded');
        }
        var filename = [req.body.json_path, req.files.file.name].join('.');
        if (req.body.language && req.body.language.length > 0) {
          filename = [req.body.json_path, req.body.language, req.files.file.name].join('.');
        }
        req.files.file.mv(
            taskFilePath(req.body.path, filename),
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    filename
                });
            }
        );
    },


    getContent: (req, res) => {
        fs.readFile(
            taskFilePath(req.body.path, req.body.filename),
            (err, content) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    content: content.toString('base64'),
                    binary: is_binary_file(content)
                });
            }
        )
    },


    setContent: (req, res) => {
        if(req.body.old_filename) {
            shell.rm(
                taskFilePath(req.body.path, req.body.old_filename)
            );
        }
        var buf = Buffer.from(req.body.content, 'base64');
        fs.writeFile(
            taskFilePath(req.body.path, req.body.new_filename),
            buf,
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({});
            }
        );
    }

}
