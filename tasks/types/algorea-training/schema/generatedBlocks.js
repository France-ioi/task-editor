module.exports = {
    title: 'Generated blocks',
    oneOf: [
        {
            type: 'object',
            title: 'Shared',
            properties: {
                shared: {
                    title: 'Shared among levels blocks',
                    type: 'sortable_list',
                    items: require('./blocks/generated.js')
                }
            },
            required: ['shared']
        },
        {
            type: 'object',
            title: 'Distinct',
            properties: {
                shared: {
                    title: 'Shared among levels blocks',
                    type: 'sortable_list',
                    items: require('./blocks/generated.js')
                },
                easy: {
                    title: 'Easy level blocks',
                    type: 'sortable_list',
                    items: require('./blocks/generated.js')
                },
                medium: {
                    title: 'Medium level blocks',
                    type: 'sortable_list',
                    items: require('./blocks/generated.js')
                },
                hard: {
                    title: 'Hard level blocks',
                    type: 'sortable_list',
                    items: require('./blocks/generated.js')
                }
            },
            required: ['shared', 'easy', 'medium', 'hard']
        }
    ]
};
