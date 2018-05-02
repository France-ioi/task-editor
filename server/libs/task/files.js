var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var config = require('../../config');


module.exports = function(task_path, old_files) {

    var new_files = [];


    function getRealName(file, data_path, index) {
        var prefix = 'root.' + data_path.join('.') + '.';
        if (index !== null) {
            prefix = prefix + index + '.';
        }
        return file.replace(prefix, '');
    }


    function processMask(mask, real_name, index) {
        var ext = path.extname(real_name);
        var replace = {
            '[index]': index,
            '[name]': path.basename(real_name, ext),
            '[ext]': ext
        }
        return mask.replace(/\[\w+\]/g, function (placeholder) {
            return replace[placeholder] || '';
        });
    }


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
        getRealName: getRealName,
        processMask: processMask,

        copy: function(src, dst_mask, data_path) {
            if(src instanceof Array) {
                for(var i=0; i<src.length; i++) {
                    if(!src[i]) continue
                    var real_name = getRealName(src[i], data_path, i)
                    var dst = processMask(dst_mask, real_name, i + 1)
                    copyFile(src[i], dst)
                }
            } else if(typeof(src) == 'string' && src != '') {
                var real_name = getRealName(src, data_path, null)
                var dst = processMask(dst_mask, real_name, null)
                copyFile(src, dst)
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
