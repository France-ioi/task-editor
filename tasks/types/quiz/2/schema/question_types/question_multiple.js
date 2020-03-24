module.exports = {
    title: "Question",
    type: "object",
    required: ["text", "answers"],
    id: "question_multiple",
    properties: {
        text: {
            title: "Question text",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            }
        },
        answers: {
            title: "Answers",
            type: "array",
            format: "tabs",
            items: {
                headerTemplate: "Answer #{{i}}",
                type: "object",
                required: ["text", "correct"],
                properties: {
                    text: {
                        title: "Answer text",
                        type: "string",
                        format: "html",
                        options: {
                            wysiwyg: true
                        }
                    },
                    correct: {
                        title: "Correct answer",
                        type: "boolean"
                    }
                }
            }
        },
        solution: {
            title: "Question solution",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            }
        },
        group_key: {
            $ref: "#/definitions/group_key"
        }
    }
}