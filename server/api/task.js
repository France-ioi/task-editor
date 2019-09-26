var fs = require('fs');
var path = require('path');
var generator = require('../libs/task/generator')
var config = require('../config')
var svn = require('../libs/svn')
var shell = require('shelljs')
var tree = require('../libs/tree')
var schema_loader = require('../libs/schema_loader')


function loadJSON(file, callback) {
    fs.readFile(
        file,
        { encoding: 'utf-8' },
        (err, data) => {
            if(err) return callback(err);
            try {
                data = JSON.parse(data);
            } catch(e) {
                return callback(new Error('Error reading JSON file: ' + file));
            }
            callback(null, data);
        }
    )
}

function taskDataFile(task_subpath) {
    return path.join(config.path, task_subpath, config.task.data_file);
}


function loadSchema(task_type, callback) {
    var task_path = path.resolve('../tasks/types/', task_type);
    try {
        var schema = schema_loader.load(task_path);
    } catch(e) {
        return callback(
            new Error('Error reading schema for task type: ' + task_type + '. ' + e.message)
        );
    }
    callback(null, schema);
}


function saveTaskData(task_subpath, task_data, callback) {
    fs.writeFile(
        taskDataFile(task_subpath),
        JSON.stringify(task_data, null, 2),
        callback
    );
}


function checkoutDependencies(user, task_subpath, task_type, callback) {
    var deps_file = path.resolve('../tasks/types/', task_type, 'dependencies.json');
    if (!fs.existsSync(deps_file)) {
        callback();
    }
    loadJSON(
        deps_file,
        (err, dependencies) => {
            if(err) return callback(err);
            Promise.all(dependencies.map((dependency_path) => {
                return new Promise((resolve, reject) => {
                    svn.checkout(user, dependency_path, (err) => {
                        err && reject(err);
                        resolve();
                    });
                });
            })).then(() => callback(null)).catch(callback);
        }
    )
}


function loadTask(req, res) {
    loadJSON(
        taskDataFile(req.body.path),
        (err, task_data) => {
            if(err) return res.status(400).send(err.message);
            checkoutDependencies(
                req.user,
                req.body.path,
                task_data.type,
                (err) => {
                    if(err) return res.status(400).send(err.message);
                    loadSchema(task_data.type, (err, schema) => {
                        if(err) return res.status(400).send(err.message);
                        res.json({
                            schema,
                            data: task_data.data
                        })
                    })
                }
            )
        }
    )
}



var api = {

    create: (req, res) => {
        loadSchema(req.body.task_type, (err, schema) => {
            if(err) return res.status(400).send(err.message);
            var task_data = {
                type: req.body.task_type,
                data: null,
                files: []
            }
            svn.checkout(req.user, req.body.path, (err) => {
                if(err) return res.status(400).send(err.message);
                saveTaskData(req.body.path, task_data, (err) => {
                    if(err) return res.status(400).send(err.message);
                    svn.addCommit(req.user, req.body.path, (err) => {
                        if(err) {
                            shell.rm('-rf', path.join(config.path, req.body.path));
                            return res.status(400).send(err.message);
                        }
                        tree.clear(req.user, req.body.path);
                        res.json({
                            schema,
                            data: null
                        });
                    })
                })
            })
        })
    },


    load: (req, res) => {
        svn.checkout(req.user, req.body.path, (err) => {
            if(err) return res.status(400).send(err.message);
            loadTask(req, res)
        })
    },


    save: (req, res) => {
        loadJSON(
            taskDataFile(req.body.path),
            (err, task_data) => {
                if(err) return res.status(400).send(err.message);
                var params = {
                    path: path.join(config.path, req.body.path),
                    data: req.body.data,
                    type: task_data.type,
                    files: task_data.files
                }
                generator.output(params, (err, task_data) => {
                    if(err) return res.status(400).send(err.message);
                    saveTaskData(req.body.path, task_data, (err) =>  {
                        if(err) return res.status(400).send(err.message);
                        svn.addCommit(req.user, req.body.path, (err) => {
                            if(err) return res.status(400).send(err.message);
                            res.json({});
                        })
                    })
                })
            }
        )
    },


    clone: (req, res) => {
        svn.checkout(req.user, req.body.path_src, (err) => {
            if(err) return res.status(400).send(err.message);
            svn.checkout(req.user, req.body.path, (err) => {
                if(err) return res.status(400).send(err.message);
                var src = path.join(config.path, req.body.path_src);
                var dst = path.join(config.path, req.body.path);
                shell.cp('-rf', src + '/*', dst + '/');
                shell.rm('-rf', src);
                svn.addCommit(req.user, req.body.path, (err) => {
                    if(err) {
                        shell.rm('-rf', dst);
                        return res.status(400).send(err.message);
                    }
                    tree.clear(req.user, req.body.path);
                    loadTask(req, res);
                })
            })
        })
    }

}

module.exports = api;