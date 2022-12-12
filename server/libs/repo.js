var fs = require('fs')
var fetch = require('node-fetch')
var url = require('url')
var npath = require('path')
var https = require('https')
var config = require('../config')


function makeFetch(auth, method, path) {
    var api_url = url.resolve(config.repository_api_url, auth.session + '/' + path)
    var opts = {
        method,
        headers: {
            'Authorization': 'Bearer ' + auth.token
        }
    }
    return fetch(api_url, opts)
}


function getJSON(auth, path, callback) {
    makeFetch(auth, 'GET', path)
        .then(res => res.json())
        .then(res => callback(null, res))
        .catch(function (err) {
            callback(err)
        })
}


function sendRequest(auth, method, path, callback) {
    makeFetch(auth, 'GET', path)
        .then(res => callback(null, res))
        .catch(function (err) {
            callback(err)
        })
}


function makePath(prefix, path) {
    return path ? prefix + '/' + path : prefix;
}



function downloadFile(auth, relative_path, callback) {
    var opts = {
        headers: {
            'Authorization': 'Bearer ' + auth.token
        }
    };
    var api_url = url.resolve(
        config.repository_api_url, 
        npath.join(auth.session, 'file', relative_path)
    )
    var dst = npath.join(config.path, auth.session, relative_path)
    var dst_path = npath.dirname(dst)
    fs.mkdirSync(dst_path, { recursive: true })
    var file = fs.createWriteStream(dst)

    https.get(api_url, opts, function(response) {
        response.pipe(file)
        file.on('finish', function() {
            file.close(callback)
        })
    }).on('error', function(err) {
        fs.unlink(dst)
        callback(err)
    })
  }


// list is relative paths
function downloadFiles(auth, path, list, callback) {
    var downloadNext = function() {
        if(list.length == 0) {
            return callback()
        }
        var file = list.pop()
        downloadFile(
            auth, 
            file,
            function(err) {
                if(err) {
                    return callback(err)
                }
                downloadNext()
            }
        )
    }
    downloadNext()
}



function readDir(dir) {
    var res = [];
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if(stat && stat.isDirectory()) { 
            res = res.concat(readDir(file))
        } else { 
            res.push(file)
        }
    });
    return res
}


function readDirRecursively(path) {
    return readDir(path).map(file => npath.relative(path, file))
}



function uploadFile(auth, relative_path, callback) {
    var opts = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
            'Content-Type': 'application/octet-stream'
        },
        method: 'PUT'
    };
    var api_url = url.resolve(
        config.repository_api_url, 
        npath.join(auth.session, 'file', relative_path)
    )
    var src = npath.join(config.path, auth.session, relative_path)

    var req = https.request(api_url, opts, function(res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        })
        res.on('end', function () {
            callback()
        })
    }).on('error', callback)
    var rs = fs.createReadStream(src, { encoding: 'binary' });
    rs.on('end', function () {
        req.end();
    });
    rs.pipe(req);
}



function uploadFiles(auth, list, callback) {
    var uploadNext = function() {
        if(list.length == 0) {
            return callback()
        }
        var file = list.pop()
        uploadFile(
            auth, 
            file, 
            function(err) {
                if(err) {
                    return callback(err)
                }
                uploadNext()
            }
        )
    }
    uploadNext()
}



var repo = {

    list: (auth, path, callback) => {
        getJSON(auth, makePath('list', path), (err, data) => {
            if(err) return callback(err)
            var list = []
            if(Array.isArray(data)) {
                for(var i=0; i<data.length; i++) {
                    var info = data[i].replace(/^\/*/, '').split('/')
                    var file_name = info.pop()
                    if(file_name == '' && info.length) {
                        // dir
                        file_name = info.pop() + '/'
                    }
                    var file_path = info.join('/')
                    if(file_path == path) {
                        list.push(file_name)
                    }
                }
            }
            callback(null, list)
        })
    },


    checkout: (auth, path, callback) => {
        getJSON(auth, makePath('list'), (err, data) => {
            if(err) return callback(err)
            if(Array.isArray(data)) {
                var list = []
                for(var i=0; i<data.length; i++) {
                    var file = data[i].replace(/^\/*/, '');
                    list.push(file);
                }
                downloadFiles(auth, path, list, callback)
            } else {
                callback();
            }
        })
    },



    saveFilesBack: (auth, path, callback) => {
        var task_path = npath.join(config.path, path)
        var files = readDirRecursively(task_path)
        uploadFiles(auth, files, callback)
    },


    remove: (auth, path, callback) => {
        fs.rmSync(npath.join(config.path, path))
        sendRequest(auth, 'DELETE', 'file/' + path, callback)
    },


    removeDir: (auth, path, callback) => {
        fs.rmdirSync(npath.join(config.path, path), {
            recursive: true
        })
        sendRequest(auth, 'DELETE', 'file/' + path, callback)
    },


    createDir: (auth, path, callback) => {
        var tmp = 'file/' + path + '/tmp.file';
        // current api version don't provide create folder method
        sendRequest(auth, 'PUT', tmp, (err, data) => {
            if(err) {
                return callback(err);
            }
            sendRequest(auth, 'DELETE', tmp, callback)
        });
    },


    getImporterUrl: (auth, path) => {
        var params = Object.assign({
            type: 'svn',
            path: path,
            token: auth.token,
            display: 'frame',
            autostart: 1
        }, config.task_importer_params);
        var q = [];
        for(var k in params) {
            if(params.hasOwnProperty(k)) {
                q.push(k + '=' + encodeURIComponent(params[k]));
            }
        }
        return cfg_task_importer.url + '?' + q.join('&');
    }
}

module.exports = repo