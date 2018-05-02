require('node-env-file')(__dirname + '/../.env')
var generator = require('./libs/task/generator')
var config = require('./config')
var path = require('path')
var fs = require('fs')


function taskDataFile(task_subpath) {
    return path.join(config.path, task_subpath, config.task.data_file);
}

function loadTaskData(task_subpath, callback) {
    fs.readFile(
        taskDataFile(task_subpath),
        { encoding: 'utf-8' },
        (err, task_data) => {
            if (err) return callback(err);
            try {
                task_data = JSON.parse(task_data);
            } catch (e) {
                return callback(new Error('Error reading task data. ' + e.message));
            }
            callback(null, task_data);
        }
    )
}


function saveTaskData(task_subpath, task_data, callback) {
    fs.writeFile(
        taskDataFile(task_subpath),
        JSON.stringify(task_data, null, 2),
        callback
    );
}


var task_path = 'Tests/test-dev'
loadTaskData(task_path, (err, task_data) => {
    if (err) return console.error(err)
    var params = {
        path: path.join(config.path, task_path),
        data: task_data.data,
        type: task_data.type,
        files: task_data.files
    }
    generator.output(params, (err, task_data) => {
        if (err) return console.error(err)
        saveTaskData(task_path, task_data, (err) => {
            if (err) return console.error(err)
        })
    })
})