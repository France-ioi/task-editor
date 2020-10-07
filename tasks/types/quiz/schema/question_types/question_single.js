module.exports = {
    title: "Question single choice",
    type: "object",
    required: ["text", "answers", "correct_answer"],
    id: "question_single",
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
                required: ["text"],
                properties: {
                    text: {
                        title: "Answer text",
                        type: "string",
                        format: "html",
                        options: {
                            wysiwyg: true
                        }
                    }
                }
            }
        },
        correct_answer: {
            title: "Correct answer",
            type: "string",
            watch: {
                answers: "question_single.answers"
            },
            enumSource: [
                {
                    source: "answers",
                    title: "Answer #{{i}}",
                    value: "{{i}}"
                }
            ]
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
