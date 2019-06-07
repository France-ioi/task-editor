module.exports = {
    type: 'array',
    format: 'tabs',
    title: 'difficulties',
    minItems: 1,
    maxItems: 3,
    items: {
        type: 'object',
        title: 'level',
        headerTemplate: 'level {{ i1 }}',
        properties: {
            name: {
                type: 'string'
            },
            scene: {
                type: 'grid',
                watch: {
                    sceneContext: 'root.context'
                }
            },
            gridInfo: {
                type: 'object',
                description: 'Meta-data specific to subTask.gridInfos..',
                properties: {
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
                    maxInstructions: {
                        type: 'integer',
                        title: 'maxInstructions'
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

                    additionalBlocksByLevel: {
                        type: 'object',
                        description: ' La gestion des blocs ',
                        properties: {
                            generatedBlocks: {
                                type: 'object',
                                description: 'La gestion des instruction pour le robot',
                                properties: {
                                    robot: {
                                        type: 'array',
                                        description: 'La gestion des instruction selon le niveau ',
                                        items: require('./blocks/generated.js')
                                    }
                                },
                                required: ['robot']
                            },
                            standardBlocks: {
                                type: 'object',
                                description: ' La gestion des blocs pour l algorithme',
                                properties: {
                                    includeAll: {
                                        type: 'boolean',
                                        format: 'checkbox',
                                        title: 'includeAll'
                                    },
                                    wholeCategories: {
                                        type: 'sortable_list',
                                        description: 'Bloc pour le robot.',
                                        items: require('./blocks/generated.js')
                                    },
                                    singleBlocks: {
                                        type: 'sortable_list',
                                        description: "La gestion des blocs pour l'algorithme.",
                                        items: require('./blocks/single.js')
                                    }
                                },
                                required: ['includeAll', 'wholeCategories', 'singleBlocks']
                            }
                        },
                        required: ['generatedBlocks', 'standardBlocks']
                    },
                    checkEndCondition: {
                        type: 'string',
                        description: 'methode de verification de la solution.',
                        enum: ['checkReachExit', 'checkPickedAllWithdrawables', 'checkContainersFilled', 'checkBothReachAndCollect']
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
                        title: 'cignoreInvalidMoves'
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
                    variables: {
                        type: 'array',
                        description: 'Context used by the task.',
                        items: {
                            type: 'string',
                            title: 'variables'
                        }
                    }
                },
                required: ['maxInstructions']
            },
            displayHelperThreshold: {
                type: 'integer',
                title: 'threshold',
                description: 'Threshold of the displayHelper for the current difficulty'
            }
        },
        required: ['scene', 'gridInfo', 'displayHelperThreshold']
    }
};
