module.exports = function(value, data_path) {
    var res = [];
//    var regexp = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\').+\>/gi;
    var regexp = /<img.*?src="([^">]*\/([^">]*?))".*?>/g
    var m;
    while(m = regexp.exec(value)) {
        res.push(m[1]);
    }
    return res;
}