var fs = require('fs');
var path = require('path');
var shell = require('shelljs');


var task_tmp_files = 'task_content_files/'

module.exports = {

    upload: (req, res) => {
        if(!req.files) {
            return res.status(400).send('File not uploaded');
        }

        var filename = [req.body.json_path, req.files.file.name].join('.');
        var filepath = path.join(
            req.body.path,
            task_tmp_files
        );
        shell.mkdir('-p', filepath);

        req.files.file.mv(
            path.join(filepath, filename),
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    filename,
                    // TODO preview path
                    url: 'http://task-editor.dev/task_output/' + task_tmp_files + filename
                });
            }
        );
    },

}