module.exports = function(title) {
    return {
        title: title,
        type: 'object',
        properties: {
            scenes: {
                type: 'array',
                title: 'Scenes',
                items: {
                    type: 'grid',
                    watch: {
                        sceneContext: 'root.gridInfos.contextType'
                    }
                }
            },
            displayHelperThreshold: {
                type: 'integer',
                title: 'displayHelperThreshold',
                description: 'Threshold of the displayHelper for the current difficulty'
            }
        },
        required: ['scenes']
    }
}