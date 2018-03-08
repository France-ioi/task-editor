var path = require('path')

module.exports = {

    port: process.env.PORT,

    task: {
        tmp_dir: 'task_content_files',
        data_file: 'task_editor.json',
    },

    // tasks url prefix
    url_prefix: '/tasks',

    // path to tasks dir
    path: process.env.TASKS_ROOT,

    // task importer
    task_importer: {
        url: process.env.TASK_IMPORTER_URL,
        params: {
            display: 'frame'
        }
    }
}