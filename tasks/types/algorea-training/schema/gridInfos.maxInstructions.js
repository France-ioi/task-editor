module.exports = {
    oneOf: [
        {
            type: 'object',
            title: 'Shared',
            properties: {
                shared_value: {
                    display_in_parent: true,
                    title: 'Value',
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 99
                }
            },
            required: ['shared_value']
        },
        {
            type: 'object',
            title: 'Distinct',
            properties: {
                basic: {
                    title: 'Basic',
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 99
                },
                easy: {
                    title: 'Easy',
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 99
                },
                medium: {
                    title: 'Medium',
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 99
                },
                hard: {
                    title: 'Hard',
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 99
                }
            },
            required: ['basic', 'easy', 'medium', 'hard']
        }
    ],
    generator: [
        {
            input: {
                collector: 'collectors/subTask.gridInfos.maxInstructions.js'
            },
            output: {
                inject: {
                    template: 'task.js',
                    selector: '$subTask.gridInfos.maxInstructions'
                }
            }
        }
    ]
};