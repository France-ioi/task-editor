module.exports = {
    title: "Task",
    type: "object",
    description: 'This editor allows you to edit the various aspects of a task. All the data in this editor is organized as a JSON object, whose properties represent each task part. Some properties are optional, and are hidden by default in the editor; to display them, click "Object properties" on each tree item to add these optional properties.',
    definitions: {
        fileDescr: {
            type: "string",
            format: "url",
            options: {
                upload: true
            }
        },
        compilationDescr: require("./compilationDescr.js"),
        executionParams: require("./executionParams"),
        compileAndRunParams: {
            type: "object",
            description: "Parameters for a compilation and an execution.",
            properties: {
                compilationDescr: {
                    $ref: "#/definitions/compilationDescr"
                },
                compilationExecution: {
                    $ref: "#/definitions/executionParams"
                },
                runExecution: {
                    $ref: "#/definitions/executionParams"
                }
            },
            required: ["compilationDescr", "compilationExecution", "runExecution"]
        },
        filename: {
            type: "string",
            description: "A valid file name.",
            pattern: "^\\w[\\w.~/-]+$"
        }
    },
    properties: {
        title: {
            type: "string",
            description: "Title of the window.",
            title: "Title",
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "title"
                        }
                    }
                }
            ]
        },
        windowLanguage: {
            type: "string",
            description: "Language for the window.",
            enum: ["fr", "en", "de"],
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "$stringsLanguage"
                        }
                    }
                }
            ]
        },
        AlgoreaTrainingTaskMetaData: require("./AlgoreaTrainingTaskMetaData.js"),
        PEMTaskMetaData: require("./PEMTaskMetaData.js"),
        task: require('./task.js'),
        context: {
            type: "string",
            enum: ["none", "arrows", "cards", "gems", "chticode_abs", "chticode_rel", "cones", "course", "dominoes", "marbles", "objects_in_space", "paint", "rocket", "sokoban", "new"]
        },
        conceptViewer: {
            type: "boolean",
            format: "checkbox",
            title: "conceptViewer"
        },
        groupByCategory: {
            type: "boolean",
            format: "checkbox",
            title: "groupByCategory"
        },
        generatedBlocks: {
            type: "array",
            uniqueItems: true,
            format: "select",
            description: " La gestion des instructions pour le robot",
            items: require("./blocks/generated.js")
        },
        standardBlocks: {
            type: "object",
            description: " La gestion des blocs pour l algorithme",
            properties: {
                includeAll: {
                    type: "boolean",
                    format: "checkbox",
                    title: "includeAll"
                },
                wholeCategories: {
                    type: "array",
                    uniqueItems: true,
                    format: "select",
                    description: "Bloc pour le robot.",
                    items: require("./blocks/generated.js")
                },
                singleBlocks: {
                    type: "array",
                    uniqueItems: true,
                    format: "select",
                    description: "La gestion des blocs pour l'algorithme.",
                    items: {
                        type: "string",
                        title: "singleBlocks",
                        enum: ["controls_if", "ccontrols_if_else", "controls_repeat", "controls_repeat_ext", "controls_whileUntil", "controls_untilWhile", "logic_negate", "logic_boolean", "logic_compare", "logic_operation", "text_join", "math_arithmetic", "math_number"]
                    }
                }
            },
            required: ["includeAll", "wholeCategories", "singleBlocks"]
        },

        difficulties: require("./difficulties.js")
    },
    required: ["title", "windowLanguage", "conceptViewer", "groupByCategory", "generatedBlocks", "standardBlocks", "AlgoreaTrainingTaskMetaData", "PEMTaskMetaData", "task", "context", "difficulties"]
};