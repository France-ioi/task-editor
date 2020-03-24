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
        feedback_score: {
            title: "Feedback score",
            type: "string",
            enum: ["none", "binary", "exact"]
        },
        feedback_on_wrong_choices: {
            title: "Feedback on wrong choices",
            type: "string",
            enum: ["none", "first_under_question", "first_under_choice", "selected_only", "all"]
        },
        feedback_on_correct_choices: {
            title: "Feedback on correct choices",
            type: "string",
            enum: ["none", "selected_only", "all"]
        },
        show_solutions: {
            title: "Show solutions",
            type: "string",
            enum: ["none", "correct_only", "all"]
        },
        alert_if_no_answer: {
            type: "boolean",
            title: "Alert if no answer"
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