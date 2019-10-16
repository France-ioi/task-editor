var repo = require('../libs/repo')

function getImporterUrl(req, res) {
    if(!req.path) return res.status(400).send('No task path provided');
    var data = {url: repo.getImporterUrl(req.user, req.body.path)};
    res.json(data);
}


module.exports = {
    getImporterUrl
}
