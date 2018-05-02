var modifiers = {
    images_src: require('./images_src')
}


module.exports = {

    execute: function(modifier, value, data_path) {
        if (modifier in modifiers) {
            return modifiers[modifier](value, data_path)
        }
        throw new Error('Unsupported modifier: ' + modifier)
    }

}