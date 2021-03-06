var path = require('path');
var repo = require('../libs/repo')
var tree = require('../libs/tree')
var shell = require('shelljs')
var config = require('../config')

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
    repo.createDir(req.user, rel_dir, (err) => {
        if(err) return res.status(400).send(err.message);
        tree.clear(req.user, req.body.path)
        tree.readDir(req.user, req.body.path, (err, data) => {
            if(err) return res.status(400).send(err.message)
            res.json(data)
        })
    })
}



function remove(req, res) {
    repo.removeDir(req.user, req.body.path, (err) => {
        if(err) return res.status(400).send(err.message)
        var parent_dir = req.body.path.split('/')
        parent_dir.pop()
        parent_dir = parent_dir.join('/')
        shell.rm('-rf', path.join(config.path, req.body.path))
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
