module.exports = function(task_data) {


    function find(path) {
        var pointer = task_data;
        var current;
        while(path.length) {
            current = path.shift();
            if(!pointer[current]) {
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