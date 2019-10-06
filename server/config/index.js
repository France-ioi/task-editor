var path = require('path')

module.exports = {
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
    task_importer: {
        url: process.env.TASK_IMPORTER_URL,
        params: {
            display: 'frame',
            autostart: '1'
        }
    },

    // Repositories
    repositories: {
        "v01": {
            type: 'svn',
            repository: process.env.SVN_REPOSITORY
        }
    },
    auth_path: 'v01/',

    dev: {
        task_autoload: process.env.DEV_TASK_AUTOLOAD,
        username: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
        log: !!process.env.DEV_LOG,
        debug: !!process.env.DEV_DEBUG
    }

};
