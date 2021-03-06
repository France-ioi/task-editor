module.exports = {
    type: "object",
    title: "Quizz settings",
    properties: {
        graderUrl: {
            type: "string",
            title: "Server side grader URL",
            description: "If hosting the quiz on France-ioi servers, use 'https://static-items.algorea.org/bsm/quiz'."
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
        },
        hide_restart: {
            type: "boolean",
            title: "Hide \"Restart\" button"
        },
        display_return_to_top: {
            type: "boolean",
            title: "Display \"Return to the list of questions\" button"
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
