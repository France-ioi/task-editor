var path = require('path');
var tasks_config = require('../../../tasks/types/config.json');


// return versions from task_data or first version from task type versions list
function detectVersion(task_data) {
    if('version' in task_data) {
        return task_data.version;
    }
    return getFirstVersion(task_data.type);
}


// return last available version
function getFirstVersion(task_type) {
    var item = tasks_config.find(item => item.type == task_type);
    return item.versions[0];
}

// return last available version
function getLatestVersion(task_type) {
    var item = tasks_config.find(item => item.type == task_type);
    return item.versions[item.versions.length - 1];
}


// return task templates path
function getPath(task_data) {
    var version = detectVersion(task_data);
    return path.resolve(
        __dirname,
        path.join('../../../tasks/types/', task_data.type, version)
    );
}


module.exports = {
    detectVersion,
    getLatestVersion,
    getPath
}