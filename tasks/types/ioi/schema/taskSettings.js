module.exports = {
    title: "taskSettings.json",
    description:
        'Optional taskSettings.json file for the task. Please refer to the documentation at https://france-ioi.github.io/taskgrader/tasksettings/',
    type: "object",
    generator: [
        {
            input: {
                step: 2
            },
            output: {
                inject: {
                    template: "taskSettings.json",
                    translate: false,
                    selector: ""
                }
            }
        }
    ],
    properties: {
        generator: {
            type: "string",
            description: "Path to the generator, relative to the task folder."
        },
        sanitizer: {
            type: "string",
            description: "Path to the sanitizer, relative to the task folder."
        },
        checker: {
            type: "string",
            format: "url",
            options: {
                upload: true,
                editor: true
            },
            description:
                "Checker program. The language of the checker will be automatically determined from its file extension.",
            generator: [
                {
                    output: {
                        copy: "tests/gen/checker[ext]"
                    }
                },
                {
                    input: { value: "tests/gen/checker[ext]" },
                    output: { replace: true }
                }
            ]
        },

        sanitizerLang: {
            type: "string",
            description: "Language of the sanitizer."
        },
        checkerLang: {
            type: "string",
            description: "Language of the checker."
        },

        generatorDeps: {
            type: "array",
            description: "List of dependencies for the generator.",
            items: { $ref: "#/definitions/fileDescr" }
        },
        sanitizerDeps: {
            type: "array",
            description: "List of dependencies for the sanitizer.",
            items: { $ref: "#/definitions/fileDescr" }
        },
        checkerDeps: {
            type: "array",
            description: "List of dependencies for the checker.",
            items: { $ref: "#/definitions/fileDescr" }
        },

        extraDir: {
            type: "string",
            description:
                'Path to scan for "extraFiles", such as test files or libraries which aren\'t generated. Default is "tests/files/".'
        },

        ignoreTests: {
            type: "array",
            description:
                "List of glob-style filenames to ignore while scanning for test cases. These test cases will be ignored by genJson, and thus not used for evaluation.",
            items: {
                type: "string",
                description: "Glob-style filename to ignore."
            }
        },

        correctSolutions: {
            type: "array",
            description:
                'List of "correct solutions", which are solutions which will be automatically evaluated against the task and checked for consistency against an expected grade.',
            items: {
                type: "object",
                description: "A correct solution.",
                properties: {
                    path: {
                        type: "string",
                        description: "Full path to the solution."
                    },
                    language: {
                        type: "string",
                        description: "Language of the solution."
                    },
                    grade: {
                        oneOf: [
                            { type: "integer" },
                            { type: "array", items: { type: "integer" } }
                        ],
                        description: "Expected average grade or list of grades."
                    },
                    nbtests: {
                        type: "integer",
                        description:
                            "Number of test cases this solution is expected to be evaluated against."
                    }
                },
                required: ["path"]
            }
        },

        overrideParams: {
            type: "object",
            description:
                'Paramters to override in the generated "defaultParams.json" file. The keys of this object will be copied as-is to the file.'
        },

        defaultEvaluationGenerators: {
            type: "array",
            description:
                "List of generators to compile. Will override automatic detection. Recommended only for advanced users.",
            items: {
                type: "object",
                description:
                    "Generator, generates tests and libraries to be used for evaluation.",
                properties: {
                    id: {
                        type: "string",
                        description: "Name of the generator."
                    },
                    compilationDescr: {
                        $ref: "#/definitions/compilationDescr"
                    },
                    compilationExecution: {
                        $ref: "#/definitions/executionParams"
                    }
                },
                required: ["id", "compilationDescr", "compilationExecution"]
            }
        },

        defaultEvaluationGenerations: {
            type: "array",
            description:
                "List of generations (executions of generators). Will override automatic detection. Recommended only for advanced users.",
            items: {
                type: "object",
                description: "Generation (execution of a generator).",
                properties: {
                    id: {
                        type: "string",
                        description: "Name of the generation."
                    },
                    idGenerator: {
                        type: "string",
                        description:
                            "Name of the tests and libraries generator."
                    },
                    idOutputGenerator: {
                        type: "string",
                        description:
                            "Name of the results generator, if applicable."
                    },
                    genExecution: { $ref: "#/definitions/executionParams" },
                    outGenExecution: { $ref: "#/definitions/executionParams" },
                    testCases: {
                        type: "array",
                        description: "List of specific test cases to generate.",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    $ref: "#/definitions/filename",
                                    description:
                                        "Filename of the test to generate."
                                },
                                params: {
                                    type: "string",
                                    description:
                                        "Command-line arguments for the generator."
                                }
                            },
                            required: ["name", "params"]
                        }
                    }
                },
                required: ["id", "idGenerator", "genExecution"]
            }
        },

        defaultEvaluationExtraTests: {
            type: "array",
            description: "List of specific test files to import.",
            items: { $ref: "#/definitions/fileDescr" }
        },

        defaultEvaluationSanitizer: {
            description:
                "Sanitizer, tests whether an input file is a valid test. Will override automatic detection. Recommended only for advanced users.",
            $ref: "#/definitions/compileAndRunParams"
        },

        defaultEvaluationChecker: {
            description:
                "Checker, grades the solution's result. Will override automatic detection. Recommended only for advanced users.",
            $ref: "#/definitions/compileAndRunParams"
        },

        defaultEvaluationSolutions: {
            type: "array",
            description:
                "List of solutions to grade. Will override automatic detection. Recommended only for advanced users.",
            items: {
                type: "object",
                description: "Solution to be graded.",
                properties: {
                    id: {
                        type: "string",
                        description: "Name of the solution."
                    },
                    compilationDescr: {
                        $ref: "#/definitions/compilationDescr"
                    },
                    compilationExecution: {
                        $ref: "#/definitions/executionParams"
                    }
                },
                required: ["id", "compilationDescr", "compilationExecution"]
            }
        },

        defaultEvaluationExecutions: {
            type: "array",
            description:
                "List of solution executions. Will override automatic detection. Recommended only for advanced users.",
            items: {
                type: "object",
                description:
                    "Execution of a solution on one or multiple tests.",
                properties: {
                    id: {
                        type: "string",
                        description: "Name of the execution."
                    },
                    idSolution: {
                        type: "string",
                        description: "Name of the solution to grade."
                    },
                    filterTests: {
                        type: "array",
                        description:
                            "List of globs filtering tests to input to the solution.",
                        items: {
                            type: "string",
                            pattern: "^[^/]+$"
                        }
                    },
                    noFeedbackTests: {
                        type: "array",
                        description:
                            "List of globs filtering tests (selected with filterTests) whose outputs will be hidden.",
                        items: {
                            type: "string",
                            pattern: "^[^/]+$"
                        }
                    },
                    runExecution: { $ref: "#/definitions/executionParams" }
                },
                required: ["id", "idSolution", "filterTests", "runExecution"]
            }
        }
    }
};
