var path = require('path')
var repo = require('../repo')

module.exports = function(params, data_info) {

    var values = {}

    function addValue(key, value) {
        values['%%' + key + '%%'] = value
    }

    addValue('TASK_PATH', repo.getReverseTaskPath(params.path))
    addValue('TASK_DATA_INFO', JSON.stringify(data_info))
    addValue('LANG_DIR', 'ltr')

    return {
        apply: function(content) {
            return content.replace(
                /%%\w+%%/g,
                (key) => {
                    return values[key] || key
                }
            )
        },
        setDirectionality: function(direction) {
            addValue('LANG_DIR', direction)
        }
    }
}
