module.exports = {
    type: 'object',
    title: 'displayHelper',
    properties: {
        thresholdEasy: {
            type: 'integer',
            title: 'thresholdEasy',
            default: 5000,
            generator: [
                {
                    output: {
                        inject: {
                            template: 'task.js',
                            selector: '$displayHelper.thresholdEasy'
                        }
                    }
                }
            ]
        },
        thresholdMedium: {
            type: 'integer',
            title: 'thresholdMedium',
            default: 10000,
            generator: [
                {
                    output: {
                        inject: {
                            template: 'task.js',
                            selector: '$displayHelper.thresholdMedium'
                        }
                    }
                }
            ]
        }
    },
    required: ['thresholdEasy', 'thresholdMedium']
}