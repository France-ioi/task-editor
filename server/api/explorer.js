var path = require('path');
var svn = require('../libs/svn')
var tree = require('../libs/tree')



function readDir(req, res) {
    if(req.body.refresh) {
        tree.clear(req.user, req.body.path)
    }
    tree.readDir(req.user, req.body.path, (err, data) => {
        if(err) return res.status(400).send(err.message)
        res.json(data)
    })
}



function createDir(req, res) {
    var rel_dir = path.join(req.body.path, req.body.dir)
    svn.createDir(req.user, rel_dir, (err) => {
        if(err) return res.status(400).send('Access denied');
        tree.clear(req.user, req.body.path)
        tree.readDir(req.user, req.body.path, (err, data) => {
            if(err) return res.status(400).send(err.message)
            res.json(data)
        })
    })
}



function remove(req, res) {
    svn.removeDir(req.user, req.body.path, (err) => {
        if(err) return res.status(400).send('Access denied')
        var parent_dir = req.body.path.split('/')
        parent_dir.pop()
        parent_dir = parent_dir.join('/')
        tree.clear(req.user, parent_dir)
        tree.readDir(req.user, parent_dir, (err, data) => {
            if(err) return res.status(400).send(err.message)
            res.json(data)
        })
    })
}


module.exports = {
    readDir,
    createDir,
    remove
}