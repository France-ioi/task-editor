var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var config = require('../../config');
var formatValue = require('./formatters');


module.exports = function(task_path, old_files) {

    var new_files = [];

    function copyFile(src, dst) {
        new_files.push(
            path.join(config.task.tmp_dir, src),
            dst
        );
        var dst_file = path.join(task_path, dst);
        shell.mkdir('-p', path.dirname(dst_file));
        shell.cp(
            '-u',
            path.join(task_path, config.task.tmp_dir, src),
            dst_file
        );
    }


    return {

        copy: function(src, dst) {
            if(src instanceof Array) {
                for(var i=0; i<src.length; i++) {
                    if(!src[i]) continue;
                    copyFile(src[i], dst[i]);
                }
            } else if(typeof(src) == 'string' && src != '') {
                copyFile(src, dst);
            }
        },


        clear: function() {
            var del_files = old_files.filter(file => new_files.indexOf(file) < 0);
            // TODO: check that files are inside task dir to avoind security problems
            // TODO: remove empty dirs?
            for(var i=0, file; file=del_files[i]; i++) {
                shell.rm(path.join(task_path, file));
            }

            // remove dups
            new_files = new_files.filter(function(file, idx) {
                return new_files.indexOf(file) == idx;
            });
            return new_files;
        }
    }

}