//var path = require('path');
//var config = require('../../config');

var http = require('http');
var fs = require('fs');
var path = require('path');



module.exports = function(task_path) {

    function downloadFile(url) {
        var filename = path.basename(url);
        var file = fs.createWriteStream(path.resolve(task_path, filename));
        //TODO: add async support to generator
        var request = http.get(url, function(response) {
            response.pipe(file);
        });
    }

    return {
        execute: function (value) {
            var files = Array.isArray(value) ? value : [value];
            for(var i = 0; i < files.length; i++) {
                downloadFile(files[i])
            }
            return true;
        }
    };
};
