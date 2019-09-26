module.exports = {
    type: "object",
    description: "Task statement",
    properties: {
        title: {
            type: "string",
            description: "Title of the task.",
            title: "Title",
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "#taskTitle"
                        }
                    }
                }
            ]
        },
        taskIntro: {
            title: "Task statement",
            description: "Task statement, displayed to the user.",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            },
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "#taskIntro"
                        }
                    }
                }
            ]
        }
    },
    required: ["title", "taskIntro"]
};
