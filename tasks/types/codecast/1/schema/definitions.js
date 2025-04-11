module.exports = {
    simpleFile: {
        type: "string",
        format: "url",
        options: {
            upload: true,
            editor: true
        }
    },

    fileDescr: {
        type: "string",
        format: "url",
        options: {
            upload: true,
            editor: true
        },
        generator: [
            {
                output: {
                    copy: "tests/gen/[name][ext]"
                }
            },
            {
                input: {
                    object: {
                        name: {
                            input: { value: "[short_name][ext]" },
                            output: { replace: true }
                        },
                        path: {
                            input: {
                                value: "$TASK_PATH/tests/gen/[name][ext]"
                            },
                            output: { replace: true }
                        }
                    }
                },
                output: {
                    replace: true
                }
            }
        ],
        required: ["name"]
    },

    compilationDescr: {
        type: "object",
        description: "Description of the files required to compile a program.",
        properties: {
            language: {
                type: "string",
                description:
                    "Language of the program. Possible values: 'c', 'cpp', 'cpp11', 'ml', 'ocaml', 'java', 'javascool', 'js', 'sh', 'shell', 'pascal', 'php'', 'py', 'py2', 'py3', 'python', 'python2', 'python3'."
            },
            files: {
                type: "array",
                description: "List of source files.",
                items: { $ref: "#/definitions/fileDescr" }
            },
            dependencies: {
                type: "array",
                description: "List of dependencies.",
                items: { $ref: "#/definitions/fileDescr" }
            }
        },
        required: ["language", "files", "dependencies"]
    },

    executionParams: {
        type: "object",
        description: "Parameters of an execution.",
        properties: {
            timeLimitMs: {
                type: "integer",
                description: "Time limit in milliseconds."
            },
            memoryLimitKb: {
                type: "integer",
                description: "Memory limit in kilobytes."
            },
            useCache: {
                type: "boolean",
                description: "Use taskgrader's cached items."
            },
            executionArgs: {
                type: "string",
                description:
                    "Command-line arguments for the execution of the program."
            },
            forceStatic: {
                type: "boolean",
                description:
                    "If present, force static or non-static compilation."
            },
            continueOnError: {
                type: "boolean",
                description: "Consider errors as non-fatal."
            },
            stdoutTruncateKb: {
                type: "integer",
                description:
                    "Size in kilobytes to capture from stdout, -1 means no limit."
            },
            stderrTruncateKb: {
                type: "integer",
                description:
                    "Size in kilobytes to capture from stderr, -1 means no limit."
            },
            addFiles: {
                type: "array",
                description: "Files to add to the execution folder.",
                items: { $ref: "#/definitions/fileDescr" }
            },
            getFiles: {
                type: "array",
                description: "Files to capture in the report.",
                items: { $ref: "#/definitions/filename" }
            }
        },
        required: [
            "timeLimitMs",
            "memoryLimitKb",
            "useCache",
            "stdoutTruncateKb",
            "stderrTruncateKb",
            "getFiles"
        ]
    },

    compileAndRunParams: {
        type: "object",
        description: "Parameters for a compilation and an execution.",
        properties: {
            compilationDescr: { $ref: "#/definitions/compilationDescr" },
            compilationExecution: { $ref: "#/definitions/executionParams" },
            runExecution: { $ref: "#/definitions/executionParams" }
        },
        required: ["compilationDescr", "compilationExecution", "runExecution"]
    },

    filename: {
        type: "string",
        description: "A valid file name.",
        pattern: "^\\w[\\w.~/-]+$"
    }
};
