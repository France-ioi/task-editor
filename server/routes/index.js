var explorer = require('../api/explorer');
var task = require('../api/task');
var task_importer = require('../api/task_importer');
var svn = require('../api/svn');
var files = require('../api/files');
var images = require('../api/images');
var auth = require('../api/auth');

module.exports = function(app) {

    app.post('/api/explorer/read_dir', explorer.readDir);
    app.post('/api/explorer/create_dir', explorer.createDir);
    app.post('/api/explorer/remove', explorer.remove);

    app.post('/api/task/load', task.load);
    app.post('/api/task/save', task.save);
    app.post('/api/task/create', task.create);
    app.post('/api/task/clone', task.clone);

    app.post('/api/task/importer', task_importer.getImporterUrl);

    app.post('/api/svn/update', svn.update);
    app.post('/api/svn/commit', svn.commit);

    app.post('/api/files/upload', files.upload);
    app.post('/api/files/get_content', files.getContent);
    app.post('/api/files/set_content', files.setContent);

    app.post('/api/images/upload', images.upload);
    app.post('/api/images/search', images.search);

    app.post('/api/auth/login', auth.login);
    app.post('/api/auth/logout', auth.logout);
    app.post('/api/auth/credentials', auth.credentials);
}
