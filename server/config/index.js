var path = require('path')

module.exports = {

    task: {
        tmp_dir: 'task_content_files',
        files_index: 'task_content_files/.index.json',
        content_data: 'task_content.json',
    },

    // tasks url prefix
    url_prefix: '/tasks',

    // path to tasks dir
    path: path.resolve(__dirname, '../../')
}