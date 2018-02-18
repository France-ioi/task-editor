var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var config = require('../config')

module.exports = {

    upload: (req, res) => {
        if(!req.files) {
            return res.status(400).send('File not uploaded');
        }

        var filename = [req.body.json_path, req.files.file.name].join('.');
        var filepath = path.join(
            config.path,
            req.body.path,
            config.task.tmp_dir
        );
        shell.mkdir('-p', filepath);

        req.files.file.mv(
            path.join(filepath, filename),
            (err) => {
                if(err) return res.status(400).send(err.message);
                res.json({
                    filename
                });
            }
        );
    },

}