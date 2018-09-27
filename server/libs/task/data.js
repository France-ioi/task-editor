module.exports = function(task_data) {

    var local_data = task_data;
    var local_modifications = false;

    function find(path, data, inArray, value) {
        var subpath = path.slice();
        var curpath = [];
        var pointer = data;
        var current;
        while(subpath.length) {
            if(!pointer.hasOwnProperty(subpath[0]) && pointer instanceof Array) {
                var resultArray = [];
                for(var i=0; i < pointer.length; i++) {
                    var newVal = find(subpath, pointer[i], true, value);
                    curpath.push(i);
                    if(newVal instanceof Array) {
                        for(var j=0; j < newVal.length; j++) {
                            if(newVal[j] == null) { continue; }
                            if(newVal[j].path) {
                                resultArray.push({
                                    path: curpath.concat(newVal[j].path),
                                    value: newVal[j].value
                                });
                            } else {
                                resultArray.push({
                                    path: curpath.concat(subpath).concat([j]),
                                    value: newVal[j]
                                });
                            }
                        }
                    } else {
                        resultArray.push({
                            path: curpath.concat(subpath),
                            value: newVal
                        });
                    }
                    curpath.pop();
                }
                return resultArray;
            } else {
                current = subpath.shift();
                curpath.push(current);
                if(!pointer.hasOwnProperty(current)) {
                    if(inArray) { return null; }
                    throw new Error('JSON path not found: ' + path.join('.'))
                }
                if(typeof value != 'undefined' && !subpath.length) {
                    pointer[current] = value;
                }
                pointer = pointer[current];
            }
        }
        return pointer;
    }


    return {
        get: function(json_path) {
            return find(json_path.slice(), local_data)
        },
        set: function(json_path, value) {
            if(!local_modifications) {
                // Make an actual copy of task_data to not modify the editor data
                local_data = JSON.parse(JSON.stringify(task_data));
                local_modifications = true;
            }
            return find(json_path.slice(), local_data, false, value)
        }
    }

}
