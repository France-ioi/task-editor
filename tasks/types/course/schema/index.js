module.exports = {
    title: "Course",
    type: "object",
    description: 'You can generate here a "Course task"',
    required: ["content"],
    properties: {
        content: {
            title: "Course content",
            type: "multitext",
            format: "html",
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "#content"
                        }
                    }
                }
            ]
        }
    }
};