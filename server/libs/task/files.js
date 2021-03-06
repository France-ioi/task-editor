var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var config = require('../../config');
var repo = require('../repo');


module.exports = function(task_path, old_files) {

    var new_files = [];


    function getRealName(file, data_path, index) {
/*        var prefix = 'root.' + data_path.join('.') + '.';
        if (index !== null) {
            prefix = prefix + index + '.';
        }*/
        var fileSplit = file.split('.');
        if(fileSplit.shift() != 'root') {
            return file;
        }
        var dpIdx = 0;
        while(fileSplit.length) {
            var curFs = fileSplit.shift();
            if(parseInt(curFs) == curFs) {
                // Skip array indexes
                if(dpIdx < data_path.length && data_path[dpIdx] == curFs) {
                    dpIdx++;
                }
                continue;
            }
            if(dpIdx >= data_path.length) {
                fileSplit.unshift(curFs);
                return fileSplit.join('.');
            }
            if(curFs != data_path[dpIdx]) {
                return file;
            }
            dpIdx++;
        }
        return file;
    }


    function processMask(mask, real_name, index) {
        var ext = path.extname(real_name);
        var name = path.basename(real_name, ext);

        // short_name allows some tricks in the schema
        // For example : file stored as 01__test.txt, but which will get
        // referenced as test.txt
        var short_idx = name.indexOf('__');
        var short_name = short_idx > -1 ? name.slice(short_idx+2) : name;

        var replace = {
            '[index]': index,
            '[name]': name.replace(/^orig\./, ''),
            '[short_name]': short_name,
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

    function copy(src, dst_mask, data_path, idx) {
        if(typeof idx == 'undefined') { idx = null; }
        if(src instanceof Array) {
            for(var i=0; i<src.length; i++) {
                if(!src[i]) continue
                copy(src[i], dst_mask, data_path, i);
            }
        } else if(typeof(src) == 'string' && src != '') {
            var real_name = getRealName(src, data_path, idx)
            var dst = processMask(dst_mask, real_name, idx)
            copyFile(src, dst)
        }
    }


    return {
        getRealName: getRealName,
        processMask: processMask,
        copy: copy,

        clear: function(callback) {
            // Clear old files generated by the editor
            var del_files = old_files.filter(file => new_files.indexOf(file) < 0);

            // remove dups
            new_files = new_files.filter(function(file, idx) {
                return new_files.indexOf(file) == idx;
            });

            // TODO: check that files are inside task dir to avoind security problems
            // TODO: remove empty dirs?
            var repo_path = path.relative(config.path, task_path);
            if(repo_path.includes('..')) {
                console.log(repo_path + ' includes `..`!');
                callback(new_files);
                return;
            }
            var delFile = null;
            delFile = function() {
                if(!del_files.length) {
                    // We finished deleting files
                    callback(new_files);
                    return;
                }

                // Delete a file
                repo.remove(path.join(repo_path, del_files.pop()), delFile);
            }
            delFile();
        }
    }

}
