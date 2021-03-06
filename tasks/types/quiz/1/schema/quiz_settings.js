module.exports = {
    type: "object",
    title: "Quizz settings",
    properties: {
        graderUrl: {
            type: "string",
            title: "Server side grader URL"
        },
        shuffle_questions: {
            type: "boolean",
            title: "Shuffle questions"
        },
        shuffle_answers: {
            type: "boolean",
            title: "Shuffle answers"
        },
        mathjax: {
            type: "boolean",
            title: "MathJax"
        },
        display_partial_feedback: {
            type: "boolean",
            title: "Display partial feedback"
        },
        display_detailed_feedback: {
            type: "boolean",
            title: "Display detailed feedback"
        }
    },
    required: ["graderUrl"],
    generator: [
        {
            output: {
                inject: {
                    template: "index.html",
                    selector: "$quiz_settings"
                }
            }
        }
    ]
}