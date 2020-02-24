module.exports = {
    type: 'object',
    title: 'Difficulties',
    properties: {
        easy: require('./difficulty.js')('Easy level'),
        medium: require('./difficulty.js')('Medium level'),
        hard: require('./difficulty.js')('Hard level')
    },
    required: ['easy', 'medium', 'hard']
}