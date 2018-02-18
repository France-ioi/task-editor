var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var config = require('../../config')

module.exports = function(task_path) {


    var index_file = path.join(
        task_path,
        config.task.files_index
    );

    var new_files = [];
    var old_files = [];
    if(fs.existsSync(index_file)) {
        old_files = fs.readFileSync(
            index_file,
            { encoding: 'utf-8' }
        )
        old_files = JSON.parse(old_files);
    }


    function getRealName(file, json_path, index = null) {
        var prefix = 'root.' + json_path.join('.') + '.';
        if(index !== null) {
            prefix += index + '.';
        }
        return file.replace(prefix, '');
    }


    function processMask(mask, real_name, index = '') {
        var ext = path.extname(real_name);
        var replace = {
            '[index]': index,
            '[name]': path.basename(real_name, ext),
            '[ext]': ext
        }
        return mask.replace(/\[\w+\]/g, function(placeholder) {
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
        copy: function(mask, files, json_path) {
            if(files instanceof Array) {
                for(var i=0; i<files.length; i++) {
                    var file = files[i];
                    if(!file) continue;
                    var real_name = getRealName(files[i], json_path, i + 1);
                    var real_path = processMask(mask, real_name, i + 1);
                    copyFile(file, real_path);
                }
            } else if(files !== "") {
                var real_name = getRealName(files, json_path);
                var real_path = processMask(mask, real_name);
                copyFile(files, real_path);
            }
        },

        clear: function() {
            var del_files = old_files.filter(file => new_files.indexOf(file) < 0);
            // TODO: check that files are inside task dir to avoind security problems
            // TODO: remove empty dirs?
            for(var i=0, file; file=del_files[i]; i++) {
                shell.rm(path.join(task_path, file));
            }
            fs.writeFileSync(index_file, JSON.stringify(new_files, null, 2));
        }
    }

}