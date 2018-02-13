var explorer = require('../api/explorer');
var task = require('../api/task');
var svn = require('../api/svn');

module.exports = function(app) {

    app.post('/api/explorer/dir', explorer.readDir);

    app.post('/api/task/load', task.load);
    app.post('/api/task/save', task.save);

    app.post('/api/svn/update', svn.update);
    app.post('/api/svn/add', svn.add);
    app.post('/api/svn/commit', svn.commit);

}