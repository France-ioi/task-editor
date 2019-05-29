module.exports = {
    type: "object",
    description: "Task meta-data.",
    properties: {
        id: {
            type: "string",
            description:
                "Unique identifier for the task; we generally use the path in the SVN.",
            title: "id",
            minLength: "5"
        },
        license: {
            type: "string",
            enum: ["CC-BY-SA", "CC-BY-NC"]
        },
        authors: {
            type: "array",
            items: {
                type: "string"
            }
        },
        language: {
            type: "string",
            description:
                'Language for the task. If you want to have this task in multiple languages, copy the "index.html" file generated by this editor to another file "index_en.html" (for instance), and edit it manually.',
            enum: ["fr", "en", "de"]
        },
        version: {
            type: "string",
            title: "version"
        },
        baseUrl: {
            type: "string",
            title: "baseUrl"
        },
        supportedLanguages: {
            type: "array",
            format: "table",
            description:
                'Languages supported by the task. Use "*" to enable all languages.',
            items: {
                type: "string",
                title: "supportedLanguage",
                enum: ["*", "c", "cpp", "java", "py", "text"]
            }
        },
        hasUserTests: {
            type: "boolean",
            description:
                'Allow the user to test their solution against their own tests. If "true", the user will be presented with a test editor under the code editor, allowing them to write themselves the input which will be given to their program, and the expected output.',
            title: "User can use their own tests"
        },
        limits: {
            type: "array",
            description:
                "Execution limits (time and memory) for this task, for each language.",
            format: "table",
            title: "Limits",
            items: {
                type: "object",
                options: {
                    layout: "grid"
                },
                properties: {
                    language: {
                        title: "Language",
                        type: "string",
                        enum: ["*", "cpp", "c", "java", "py"],
                        options: {
                            grid_columns: 6
                        }
                    },
                    time: {
                        title: "Time (ms)",
                        type: "string",
                        options: {
                            grid_columns: 3
                        }
                    },
                    memory: {
                        title: "Memory (KB)",
                        type: "string",
                        options: {
                            grid_columns: 3
                        }
                    }
                },
                required: ["language", "time", "memory"]
            }
        }
    },
    required: ["id", "authors", "language"],
    generator: [
        {
            output: {
                inject: {
                    template: "index.html",
                    selector: "$PEMTaskMetaData"
                }
            }
        }
    ]
};
