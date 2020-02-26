module.exports = {
    type: 'object',
    title: 'Standard blocks',
    properties: {
        includeAll: {
            type: 'boolean',
            format: 'checkbox',
            title: 'Include all'
        },
        wholeCategories: {
            type: 'sortable_list',
            title: 'Whole categories',
            items: require('./blocks/categories.js')
        },
        singleBlocks: {
            title: 'Single blocks',
            oneOf: [
                {
                    type: 'object',
                    title: 'Shared',
                    properties: {
                        shared: {
                            display_in_parent: true,
                            title: 'Shared among levels blocks',
                            type: 'sortable_list',
                            items: require('./blocks/standard.js')
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
                            items: require('./blocks/standard.js')
                        },
                        easy: {
                            title: 'Easy level blocks',
                            type: 'sortable_list',
                            items: require('./blocks/standard.js')
                        },
                        medium: {
                            title: 'Medium level blocks',
                            type: 'sortable_list',
                            items: require('./blocks/standard.js')
                        },
                        hard: {
                            title: 'Hard level blocks',
                            type: 'sortable_list',
                            items: require('./blocks/standard.js')
                        }
                    },
                    required: ['shared', 'easy', 'medium', 'hard']
                }
            ]
        }
    },
    required: ['includeAll', 'wholeCategories', 'singleBlocks']
};