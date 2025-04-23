var fs = require('fs');
var path = require('path');
var generator = require('../libs/task/generator')
var config = require('../config')
var repo = require('../libs/repo')
var shell = require('shelljs')
var tree = require('../libs/tree')
var schema_loader = require('../libs/schema_loader')
var task_version = require('../libs/task/task_version')

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

function taskDataPath(task_subpath) {
    return path.join(config.path, task_subpath, config.task.data_file);
}

function taskFilePath(task_subpath, file) {
    return path.join(config.path, task_subpath, file);
}


function loadSchema(task_data, callback) {
    var task_path = task_version.getPath(task_data);
    try {
        var schema = schema_loader.load(task_path);
    } catch(e) {
        return callback(
            new Error('Error reading schema for task type: ' + task_data.type + '. ' + e.message)
        );
    }
    callback(null, schema);
}


function saveTaskData(task_subpath, task_data, callback) {
    fs.writeFile(
        taskDataPath(task_subpath),
        JSON.stringify(task_data, null, 2),
        callback
    );
}


function checkoutDependencies(user, task_subpath, task_type, callback) {
    callback();
    /*
    //TODO: if you need this code, update next line with task version value
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
    */
}

function extractSchemaFilesPropertyPaths(schema, propertyPath, definitions) {
    var schemaFiles = [];
    if (schema.$ref) {
        schema = definitions[schema.$ref.split('/').pop()];
    }
    if (!schema) {
        return [];
    }
    if ('url' === schema.format) {
        schemaFiles.push(propertyPath);
    }
    if (!schema.properties) {
        return schemaFiles;
    }

    for (let [property, data] of Object.entries(schema.properties)) {
        var newPropertyPath = [...propertyPath, property];
        schemaFiles = [
            ...schemaFiles,
            ...extractSchemaFilesPropertyPaths(data, newPropertyPath, definitions),
        ];

        if (data.items) {
            schemaFiles = [
                ...schemaFiles,
                ...extractSchemaFilesPropertyPaths(data.items, newPropertyPath, definitions),
            ];
        }
    }

    return schemaFiles;
}

function foreachTaskDataProperty(task_data, propertyPath, callback, realPropertyPath = []) {
    if (!task_data) {
        return;
    }
    if (Array.isArray(task_data)) {
       for (var [elementId, element] of task_data.entries()) {
           foreachTaskDataProperty(element, propertyPath, callback, [...realPropertyPath, elementId]);
       }
       return;
    }

    if (0 === propertyPath.length) {
        callback(task_data, realPropertyPath);
        return;
    }
    if (!(propertyPath[0] in task_data)) {
        return;
    }

    foreachTaskDataProperty(task_data[propertyPath[0]], propertyPath.slice(1), callback, [...realPropertyPath, propertyPath[0]]);
}

function setTaskDataProperty(task_data, propertyPath, value) {
    if (!(propertyPath[0] in task_data)) {
        return;
    }

    if (1 === propertyPath.length) {
        task_data[propertyPath[0]] = value;
        return;
    }

    return setTaskDataProperty(task_data[propertyPath[0]], propertyPath.slice(1), value);
}

function backwardCompatibilityFixPaths(task, schema, taskPath) {
    let files = task.files;
    let filesPropertyPaths = extractSchemaFilesPropertyPaths(schema, [], schema.definitions);
    for (let filePropertyPath of filesPropertyPaths) {
        foreachTaskDataProperty(task.data, filePropertyPath, (taskDataValue, propertyPath) =>  {
            if (null === taskDataValue) {
                return;
            }
            if ('string' !== typeof taskDataValue && taskDataValue.name) {
                taskDataValue = taskDataValue.name;
            }

            // Find best fitting value in task.files
            let correspondingFile = files.find(file => file.startsWith('task_content_files/') && file.endsWith(taskDataValue) && fs.existsSync(taskFilePath(taskPath, file)));
            if (undefined === correspondingFile) {
                taskDataValue = taskDataValue.split('/').pop();
                correspondingFile = files.find(file => file.startsWith('task_content_files/') && file.endsWith(taskDataValue) && fs.existsSync(taskFilePath(taskPath, file)));
                if (undefined === correspondingFile) {
                    return;
                }
            }

            let correspondingFileName = correspondingFile.split('/')[1];
            if (taskDataValue !== correspondingFileName) {
                setTaskDataProperty(task.data, propertyPath, correspondingFileName);
            }
        });
    }

    return task.data;
}


function loadTask(req, res) {
    loadJSON(
        taskDataPath(req.body.path),
        (err, task_data) => {
            if(err) return res.status(400).send(err.message);
            checkoutDependencies(
                req.user,
                req.body.path,
                task_data.type,
                (err) => {
                    if(err) return res.status(400).send(err.message);
                    loadSchema(task_data, (err, schema) => {
                        if(err) return res.status(400).send(err.message);
                        res.json({
                            schema,
                            // data: task_data.data,
                            data: backwardCompatibilityFixPaths(task_data, schema, req.body.path),
                            version: task_version.detectVersion(task_data),
                            translations: task_data.translations
                        })
                    })
                }
            )
        }
    )
}

var mutexLocked = false;

var api = {

    create: (req, res) => {
        var task_data = {
            type: req.body.task_type,
            version: task_version.getLatestVersion(req.body.task_type),
            data: null,
            translations: null,
            files: []
        }
        loadSchema(task_data, (err, schema) => {
            if(err) return res.status(400).send(err.message);
            repo.checkout(req.user, req.body.path, (err) => {
                if(err) return res.status(400).send(err.message);
                saveTaskData(req.body.path, task_data, (err) => {
                    if(err) return res.status(400).send(err.message);
                    repo.addCommit(req.user, req.body.path, (err) => {
                        if(err) {
                            shell.rm('-rf', path.join(config.path, req.body.path));
                            return res.status(400).send(err.message);
                        }
                        tree.clear(req.user, req.body.path);
                        res.json({
                            schema,
                            version: task_data.version,
                            data: null
                        });
                    })
                })
            })
        })
    },


    load: (req, res) => {
        repo.checkout(req.user, req.body.path, (err) => {
            if(err) return res.status(400).send(err.message);
            loadTask(req, res)
        })
    },


    save: (req, res) => {
        loadJSON(
            taskDataPath(req.body.path),
            (err, task_data) => {
                if(err) return res.status(400).send(err.message);
                var params = {
                    path: path.join(config.path, req.body.path),
                    data: req.body.data,
                    translations: req.body.translations,
                    type: task_data.type,
                    version: req.body.version,
                    files: task_data.files
                }
                generator.output(params, (err, task_data) => {
                    if(err) return res.status(400).send(err.message);
                    saveTaskData(req.body.path, task_data, (err) =>  {
                        if(err) return res.status(400).send(err.message);
                        repo.addCommit(req.user, req.body.path, (err) => {
                            if(err) return res.status(400).send(err.message);
                            res.json({});
                        })
                    })
                })
            }
        )
    },

    saveRecursivelyDir: (req, res) => {
        // Prevent two calls to execute at the same time, to avoid that they both modify files
        // at the same time, and it creates conflicts
        if (mutexLocked) {
            return;
        }

        mutexLocked = true;
        tree.readDirRecursive(req.user, req.body.path)
            .then(dirs => {
                var p = Promise.resolve();
                for (let dir of dirs) {
                    p = p.then(() => {
                        return new Promise((resolve, reject) => {
                            loadJSON(
                                taskDataPath(dir),
                                (err, task_data) => {
                                    if (err) return reject(err);
                                    loadSchema(task_data, (err, schema) => {
                                        if (err) return reject(err);
                                        var params = {
                                            path: path.join(config.path, dir),
                                            data: backwardCompatibilityFixPaths(task_data, schema, dir),
                                            translations: task_data.translations,
                                            type: task_data.type,
                                            version: task_version.detectVersion(task_data),
                                            files: task_data.files
                                        };
                                        generator.output(params, (err, task_data) => {
                                            if (err) return reject(err);
                                            saveTaskData(dir, task_data, (err) => {
                                                if (err) return reject(err);
                                                resolve();
                                            })
                                        })
                                    });
                                }
                            )
                        })
                    })
                }

                return p
                    .then(() => {
                        repo.addCommit(req.user, req.body.path, (err) => {
                            if (err) return res.status(400).send(err.message);
                            res.json({});
                        });
                    })
            })
            .catch(err => {
                console.error(err);
                return res.status(400).send(err.message);
            })
            .finally(() => {
                mutexLocked = false;
            });
    },


    clone: (req, res) => {
        repo.checkout(req.user, req.body.path_src, (err) => {
            if(err) return res.status(400).send(err.message);
            repo.checkout(req.user, req.body.path, (err) => {
                if(err) return res.status(400).send(err.message);
                var src = path.join(config.path, req.body.path_src);
                var dst = path.join(config.path, req.body.path);
                shell.cp('-rf', src + '/*', dst + '/');
                repo.addCommit(req.user, req.body.path, (err) => {
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
