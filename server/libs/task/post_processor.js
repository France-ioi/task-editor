var path = require('path')
var config = require('../../config')

module.exports = function(params) {

    var values = {}

    function addValue(key, value) {
        values['%%' + key + '%%'] = value
    }

    addValue('TASK_PATH', path.relative(params.path, config.path))

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