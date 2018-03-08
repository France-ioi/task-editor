var formatters = {
    file: require('./file')
}


module.exports = function(modifier, value, json_path) {
    if(modifier.type in formatters) {
        return formatters[modifier.type](modifier.format, value, json_path)
    }
    throw new Error('Unsupported format: ' + format.type)
}