var parsers = {
    'image.src': function(html) {
        var res = [];
        var regexp = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/gi;
        var m;
        while(m = regexp.exec(html)) {
            res.push(m[1]);
        }
        return res;
    }
}



module.exports = function(format, value, json_path, idx) {
    if(!parsers[format]) {
        throw new Error('Parser ' + format + ' not found');
    }
    if(value instanceof Array) {
        var res = [];
        for(var i=0; i<value.length; i++) {
            res = res.concat(parsers[format](value[i]));
        }
    } else if(typeof(value) == 'string' && value != '') {
        var res = parsers[format](value);
    }
    return res;
}