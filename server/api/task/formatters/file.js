var path = require('path')

function getRealName(file, json_path, index) {
    var prefix = 'root.' + json_path.join('.') + '.';
    if(index !== null) {
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
    return mask.replace(/\[\w+\]/g, function(placeholder) {
        return replace[placeholder] || '';
    });
}


module.exports = function(format, value, json_path) {
    if(value instanceof Array) {
        var res = [];
        for(var i=0; i<value.length; i++) {
            if(!value[i]) continue;
            var real_name = getRealName(value[i], json_path, i + 1);
            res.push(processMask(format, real_name, i + 1))
        }
    } else if(typeof(value) == 'string' && value != '') {
        var real_name = getRealName(value, json_path, null);
        var res = processMask(format, real_name, '');
    }
    return res;
}