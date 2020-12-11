module.exports = {
    type: 'object',
    title: 'Difficulties',
    properties: {
        basic: require('./difficulties.item.js')('Basic level'),
        easy: require('./difficulties.item.js')('Easy level'),
        medium: require('./difficulties.item.js')('Medium level'),
        hard: require('./difficulties.item.js')('Hard level')
    },
    required: ['basic', 'easy', 'medium', 'hard']
}