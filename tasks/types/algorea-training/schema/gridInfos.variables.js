module.exports = {
    oneOf: [
        {
            type: 'object',
            title: 'Shared',
            properties: {
                shared_value: {
                    title: 'Shared',
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: ['shared_value']
        },
        {
            type: 'object',
            title: 'Distinct',
            properties: {
                easy: {
                    title: 'Easy level',
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                medium: {
                    title: 'Medium level',
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                hard: {
                    title: 'Hard level',
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: ['easy', 'medium', 'hard']
        }
    ],
    generator: [
        {
            input: {
                collector: 'collectors/subTask.gridInfos.variables.js',
                keepArray: true
            },
            output: {
                inject: {
                    template: 'task.js',
                    selector: '$subTask.gridInfos.variables'
                }
            }
        }
    ]
};