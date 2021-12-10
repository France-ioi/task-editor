module.exports = {
    type: "object",
    title: "Quizz settings",
    properties: {
        graderUrl: {
            type: "string",
            title: "Server side grader URL",
            description: "If hosting the quiz on France-ioi servers, use 'https://static-items.algorea.org/bsm/quiz'.",
            options: {
                cache_value: true
            }
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
            title: "Question score formula",
            enum: ["default", "percentage_of_correct", "balance", "disbalance", "ratio"],
            default: "all_or_nothing",
            options: {
                enum_titles: ["All or nothing", "Percentage of correct", "Balance", "Disbalance", "Points gained or lost for each selected answer"],
                enum_descriptions: [
                    "Score is 1 if all correct answers are selected and all incorrect answers are unseleted.<br>Otherwise score is 0.",
                    "Percentage of correct", 
                    "Balance", 
                    "Disbalance",
                    "Points gained or lost for each selected answer"
                ]
            }
        },


        score_calculation: {
            title: "Answer score calculation",
            oneOf: [
                {
                    type: 'object',
                    title: 'Formula',
                    properties: {
                        formula: {
                            type: "string",
                            title: "Formula",
                            enum: ["default", "percentage_of_correct", "balance", "disbalance"],
                            default: "default",
                            options: {
                                enum_titles: ["All or nothing", "Percentage of correct", "Balance", "Disbalance"],
                                enum_descriptions: [
                                    "Score is 1 if all correct answers are selected and all incorrect answers are unseleted.<br>Otherwise score is 0.",
                                    "Percentage of correct", 
                                    "Balance", 
                                    "Disbalance",
                                    "Points gained or lost for each selected answer"
                                ]
                            }
                        }
                    },
                    required: ["formula"]
                },
                {
                    type: 'object',
                    title: 'Points gained or lost for each selected answer',
                    properties: {                    
                        wrong_answer_penalty: {
                            type: "number",
                            title: "Wrong selected answer penalty ratio",
                            minimum: 0,
                            default: 1
                        }
                    },
                    required: ["wrong_answer_penalty"]
                }                
            ]            
        }
    },
    required: ["graderUrl", "score_calculation"],
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
