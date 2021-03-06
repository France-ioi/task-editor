var path = require('path')

// Server-side configuration ; will not be sent to the client
var server_config = {
    port: process.env.PORT,

    task: {
        tmp_dir: 'task_content_files',
        images_dir: 'images',
        data_file: 'task_editor.json'
    },

    // tasks url prefix
    url_prefix: '/tasks',

    // path to tasks dir
    path: process.env.TASKS_ROOT,

    // task importer
    // Repositories
    repositories: {
        "v01": {
            type: 'svn',
            repository: process.env.SVN_REPOSITORY
        }
    },
    auth_path: 'v01/',

    task_importer: {
        url: process.env.TASK_IMPORTER_URL,
        params: {
            display: 'frame',
            autostart: '1'
        }
    },

    dev: {
        log: !!process.env.DEV_LOG,
        debug: !!process.env.DEV_DEBUG
    }

};

// These configuration options will be sent publicly to the client (even
// unauthenticated!)
var client_config = {
    dev: {
        task_autoload: process.env.DEV_TASK_AUTOLOAD,
        username: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
    },
    url_prefix: server_config.url_prefix,
    task: {
        tmp_dir: server_config.task.tmp_dir
    }
};

server_config.client_config = client_config;

module.exports = server_config;
