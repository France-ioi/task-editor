module.exports = function(task_data) {


    function find(path) {
        var subpath = path.slice();
        var pointer = task_data;
        var current;
        while(subpath.length) {
            current = subpath.shift();
            if(!pointer.hasOwnProperty(current)) {
                throw new Error('JSON path not found: ' + path.join('.'))
            }
            pointer = pointer[current];
        }
        return pointer;
    }


    return {
        get: function(json_path) {
            return find(json_path.slice())
        }
    }

}