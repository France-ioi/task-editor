var path = require('path')
var config = require('../../config')

module.exports = function(params, data_info) {

    var values = {}

    function addValue(key, value) {
        values['%%' + key + '%%'] = value
    }

    addValue('TASK_PATH', params.depth > 0 ? '../'.repeat(params.depth - 1) + '..' : '.');
    addValue('TASK_DATA_INFO', JSON.stringify(data_info))
    addValue('LANG_DIR', 'ltr')

    return {
        apply: function(content) {
            return content.replace(
                /%%\w+%%/g,
                (key) => {
                    return typeof values[key] != 'undefined' ? values[key] : key;
                }
            )
        },
        setDirectionality: function(direction) {
            addValue('LANG_DIR', direction)
        }
    }
}
