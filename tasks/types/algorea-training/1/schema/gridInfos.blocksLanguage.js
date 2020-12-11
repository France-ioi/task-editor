module.exports = {
    title: 'blocksLanguage',
    oneOf: [
        {
            type: 'string',
            title: 'Shared',
            enum: ["fr", "en", "de"],
            display_in_parent: true,
        },
        {
            type: 'object',
            title: 'Distinct',
            properties: {
                blockly: {
                    type: 'string',
                    title: 'blocksLanguage',
                    enum: ["fr", "en", "de"]
                },
                python: {
                    type: 'string',
                    title: 'blocksLanguage',
                    enum: ["fr", "en", "de"]
                }
            }
        }
    ]
}