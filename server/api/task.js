var fs = require('fs');
var path = require('path');
var generator = require('./task/generator')

var json_file_name = 'task_content.json';

module.exports = {

    load: (req, res) => {
        var json_path = path.resolve(req.body.path, json_file_name);
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
        var json_path = path.resolve(req.body.path, json_file_name);
        fs.writeFile(json_path, JSON.stringify(req.body.data, null, 2), (err) => {
            if(err) res.status(400).send(err.message);
        });

        var params = {
            path: req.body.path,
            data: req.body.data
        }
        generator.output(params, err => res.json({ error: err.message }));
        return res.json({});
    }

}