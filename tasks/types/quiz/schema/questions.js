module.exports = {
    title: "Questions",
    type: "array",
    items: {
        title: "Question",
        oneOf: [
            {
                title: "Question single choice",
                $ref: "#/definitions/question_single"
            },
            {
                title: "Question multiple choice",
                $ref: "#/definitions/question_multiple"
            },
            {
                title: "Question with input",
                $ref: "#/definitions/question_input"
            },
            {
                title: "Fill in the gaps",
                $ref: "#/definitions/question_fill_gaps"
            }
        ]
    },
    generator: [
        {
            input: {
                keepArray: true
            },
            output: {
                render: {
                    template: "questions.html"
                },
                inject: {
                    template: "index.html",
                    selector: ".taskContent"
                }
            }
        },
        {
            input: {
                collector: "collectors/grader.js",
                keepArray: true
            },
            output: {
                inject: {
                    template: "grader_data.js",
                    selector: "$window.Quiz.grader.data"
                }
            }
        },
        {
            input: {
                collector: "collectors/question_types.js",
                keepArray: true
            },
            output: {
                inject: {
                    template: "index.html",
                    selector: "$quiz_question_types"
                }
            }
        }
    ]
}