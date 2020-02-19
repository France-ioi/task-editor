module.exports = {
    type: 'object',
    title: 'Standard blocks',
    properties: {
        required: ['includeAll', 'singleBlocks'],
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
                            title: 'Shared among levels blocks',
                            type: 'sortable_list',
                            items: require('./blocks/standard.js')
                        }
                    },
                    required: ['shared']
                },
                {
                    type: 'object',
                    title: 'Accurate',
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