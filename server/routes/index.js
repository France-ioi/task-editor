var explorer = require('../api/explorer');
var task = require('../api/task');
var svn = require('../api/svn');
var files = require('../api/files');

module.exports = function(app) {

    app.post('/api/explorer/read_dir', explorer.readDir);
    app.post('/api/explorer/create_dir', explorer.createDir);
    app.post('/api/explorer/remove_dir', explorer.removeDir);

    app.post('/api/task/load', task.load);
    app.post('/api/task/save', task.save);
    app.post('/api/task/create', task.create);

    app.post('/api/svn/update', svn.update);
    app.post('/api/svn/add', svn.add);
    app.post('/api/svn/commit', svn.commit);

    app.post('/api/files/upload', files.upload);

}