var fs = require('fs');
var path = require('path');

module.exports = {


    readDir: (req, res) => {
        fs.readdir(req.body.path, (err, files) => {
            if(err) return res.status(400).send(err);
            var list = [];
            if(files) {
                files.map(file => {
                    var fullfile = path.resolve(req.body.path, file);
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
            res.json(list);
        })
    }

}