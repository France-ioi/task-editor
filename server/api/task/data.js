module.exports = function(task_data) {


    function find(path, data, inArray) {
        var subpath = path.slice();
        var pointer = data;
        var current;
        while(subpath.length) {
            if(pointer instanceof Array) {
                return pointer = pointer.map(item =>
                    find(subpath, item, true));
            } else {
                current = subpath.shift();
                if(!pointer.hasOwnProperty(current)) {
                    if(inArray) { return null; }
                    throw new Error('JSON path not found: ' + path.join('.'))
                }
                pointer = pointer[current];
            }
        }
        return pointer;
    }


    return {
        get: function(json_path) {
            return find(json_path.slice(), task_data)
        }
    }

}
