var explorer = require('../api/explorer');
var task = require('../api/task');

module.exports = function(app) {

    app.post('/api/explorer/dir', explorer.readDir);

    app.post('/api/task/load', task.load);
    app.post('/api/task/save', task.save);

}