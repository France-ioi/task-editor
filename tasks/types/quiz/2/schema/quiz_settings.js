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
        },
        score_calculation_formula: {
            type: "string",
            title: "Score calculation formula",
            enum: ["all_or_nothing", "percentage_of_correct", "proportional", "unproportional"],
            default: "all_or_nothing",
            options: {
                enum_titles: ["All or nothing", "Percentage of correct", "Proportional", "Unproportional"],
                enum_descriptions: [
                    "Score is 1 if all correct answers selected and all incorrect answers unseleted, otherwise score is 0.",
                    "Percentage of correct", 
                    "Proportional", 
                    "Unproportional"
                ]
            }
        }
    },
    required: ["graderUrl", "score_calculation_formula"],
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
