var path = require('path')
var config = require('../../config')

module.exports = function(params, data_info) {

    var values = {}

    function addValue(key, value) {
        values['%%' + key + '%%'] = value
    }

    addValue('TASK_PATH', path.relative(params.path, config.path))
    addValue('TASK_DATA_INFO', JSON.stringify(data_info))

    return {
        apply: function(content) {
            return content.replace(
                /%%\w+%%/g,
                (key) => {
                    return values[key] || key
                }
            )
        }
    }
}