var fs = require('fs');
var path = require('path');
var generator = require('./task/generator')
var config = require('../config')

module.exports = {

    load: (req, res) => {
        var json_path = path.join(
            config.path,
            req.body.path,
            config.task.content_data
        );
        fs.stat(json_path, (err, stats) => {
            if(err) return res.json(null);
            var data = JSON.parse(
                fs.readFileSync(
                    json_path,
                    { encoding: 'utf-8' }
                )
            );
            return res.json(data);
        });
    },


    save: (req, res) => {
        var json_path = path.join(
            config.path,
            req.body.path,
            config.task.content_data
        );
        fs.writeFile(json_path, JSON.stringify(req.body.data, null, 2), (err) => {
            if(err) res.status(400).send(err.message);
        });

        var params = {
            path: path.join(config.path, req.body.path),
            data: req.body.data
        }
        generator.output(params, err => res.json({ error: err.message }));
        return res.json({});
    }

}