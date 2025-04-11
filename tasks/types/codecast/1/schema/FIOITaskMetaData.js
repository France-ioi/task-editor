module.exports = {
    type: "object",
    description: "Meta-data specific to taskgrader/taskplatform tasks.",
    properties: {
        taskSources: {
            type: "object",
            description: "Source files available in the task.",
            properties: {
                defaultSource: {
                    type: "array",
                    description:
                        "Source files which will populate the editor for each language, when the user first loads a task or opens a new tab with that language.",
                    items: {
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
                                    copy: "sources/[name][ext]"
                                }
                            },
                            {
                                input: {
                                    keepArray: true,
                                    value: "[name][ext]"
                                },
                                output: {
                                    replace: true
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    required: [],
    generator: [
        {
            input: {
                step: 2
            },
            output: {
                inject: {
                    template: "index.html",
                    selector: "$FIOITaskMetaData"
                }
            }
        }
    ]
};
