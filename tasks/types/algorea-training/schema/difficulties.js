module.exports = {
    type: 'object',
    title: 'Difficulties',
    properties: {
        easy: require('./difficulties.item.js')('Easy level'),
        medium: require('./difficulties.item.js')('Medium level'),
        hard: require('./difficulties.item.js')('Hard level')
    },
    required: ['easy', 'medium', 'hard']
}