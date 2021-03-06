module.exports = {
    type: 'object',
    description: 'Meta-data specific to subTask.gridInfos..',
    properties: {
        blocksLanguage: require('./gridInfos.blocksLanguage.js'),
        contextType: require('./gridInfos.contextType.js'),
        maxInstructions: require('./gridInfos.maxInstructions.js'),
        blocks: {
            type: 'object',
            title: 'Blocks',
            properties: {
                groupByCategory: {
                    type: 'boolean',
                    format: 'checkbox',
                    title: 'Group by category'
                },
                generatedBlocks: require('./gridInfos.generatedBlocks.js'),
                standardBlocks: require('./gridInfos.standardBlocks.js')
            },
            required: ['groupByCategory', 'generatedBlocks', 'standardBlocks'],
            generator: [
                {
                    input: {
                        collector: 'collectors/subTask.gridInfos.includeBlocks.js'
                    },
                    output: {
                        inject: {
                            template: 'task.js',
                            selector: '$subTask.gridInfos.includeBlocks'
                        }
                    }
                }
            ]
        },
        conceptViewer: require('./gridInfos.conceptViewer.js'),
        checkEndCondition: {
            type: 'string',
            description: 'methode de verification de la solution.',
            enum: ['checkReachExit', 'checkPickedAllWithdrawables', 'checkContainersFilled', 'checkBothReachAndCollect'],
            generator: [
                {
                    output: {
                        inject: {
                            template: 'task.js',
                            selector: '$checkEndCondition'
                        }
                    }
                }
            ]
        },
        showLabels: {
            type: 'boolean',
            format: 'checkbox',
            title: 'showLabels'
        },
        bagInit: {
            type: 'object',
            description: ' nombre d item ',
            properties: {
                count: {
                    type: 'integer',
                    description: 'Nombre .'
                },
                type: {
                    type: 'string',
                    title: 'type'
                }
            },
            required: ['count', 'type']
        },
        languageStrings: {
            type: 'object',
            description: ' personnalisation du texte ',
            properties: {
                blocklyRobot_lib: {
                    type: 'object',
                    description: ' personalisation dans la bibli blocklyRobot ',
                    properties: {
                        label: {
                            type: 'array',
                            description: 'tableau de textes.',
                            items: {
                                type: 'string',
                                title: 'label'
                            }
                        },
                        message: {
                            type: 'object',
                            description: " personalisation des message lors de l'execution du programme ",
                            properties: {
                                successReachExit: {
                                    type: 'string',
                                    description: 'en cas de succes.',
                                    successReachExit: ''
                                },
                                failureReachExit: {
                                    type: 'string',
                                    description: 'en cas d echec.',
                                    failureReachExit: ''
                                }
                            },
                            required: ['successReachExit', 'failureReachExit']
                        }
                    },
                    required: ['label', 'message']
                }
            },
            required: ['blocklyRobot_lib']
        },
        actionDelay: {
            type: 'integer',
            description: 'Nombre '
        },
        checkEndEveryTurn: {
            type: 'boolean',
            format: 'checkbox',
            title: 'checkEndEveryTurn'
        },
        ignoreInvalidMoves: {
            type: 'boolean',
            format: 'checkbox',
            title: 'ignoreInvalidMoves'
        },
        maxIterWithoutAction: {
            type: 'integer',
            description: 'Nombre '
        },
        hideSaveOrLoad: {
            type: 'boolean',
            format: 'checkbox',
            title: 'hideSaveOrLoad'
        },
        variables: require('./gridInfos.variables.js')
    },
    required: ['contextType', 'maxInstructions', 'blocks', 'conceptViewer', 'checkEndCondition']
}