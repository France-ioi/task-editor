var repo = require('./repo')
var config = require('../config')

var data = {}



function initNode(node) {
    node.loaded = false
    node.children = {}
    node.data = {
        path: null,
        list: [],
        flags: {
            is_task: false,
            is_task_subfolder: false,
            has_subfolders: false
        }
    }
}


function newNode() {
    var node = {}
    initNode(node)
    return node
}


function fillNode(node, path, list) {
    node.loaded = true
    node.data.path = path
    list.map(item => {
        var is_dir = item.indexOf('/') !== -1
        var name = item.replace(/\//g, '')
        if(is_dir) {
            node.data.flags.has_subfolders = true
            node.children[name] = newNode()
        } else if(item == config.task.data_file) {
            node.data.flags.is_task = true;
            node.data.flags.is_task_subfolder = true;
        }
        node.data.list.push({ name, is_dir})
    })
}


function getNode(username, path) {
    if(!(username in data)) {
        data[username] = newNode()
    }
    var node = data[username]
    var is_task_subfolder = node.data.flags.is_task_subfolder;
    if(path != '') {
        var steps = path.split('/')
        while(steps.length > 0) {
            var step = steps.shift()
            if(!(step in node.children)) {
                node.children[step] = newNode()
            }
            node = node.children[step]

            // Propagate is_task_subfolder
            is_task_subfolder = is_task_subfolder || node.data.flags.is_task || node.data.flags.is_task_subfolder;
            node.data.flags.is_task_subfolder = is_task_subfolder;
        }
    }
    return node
}





module.exports = {


    readDir: (user, path, callback) => {
        var node = getNode(user.username, path)
        if(node.loaded) {
            return callback(null, node.data)
        }
        repo.list(user, path, (err, list) => {
            if(err) return callback(err)
            fillNode(node, path, list)
            callback(null, node.data)
        })
    },


    clear: (user, path) => {
        var node = getNode(user.username, path)
        initNode(node)
    }

}
