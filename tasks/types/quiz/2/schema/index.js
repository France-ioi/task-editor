module.exports = {
    title: "Quiz",
    type: "object",
    description: 'You can generate here a "Quiz task"',

    properties: {
        taskMetaData: require('./taskMetaData.js'),
        quiz_settings: require('./quiz_settings.js'),
        title: {
            type: "string",
            title: "Task title",
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "title"
                        }
                    }
                }
            ]
        },
        intro: {
            title: "Statement, before questions",
            description:
                "Task statement, displayed to the user before the questions.",
            type: "multitext",
            format: "html",
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: ".intro"
                        }
                    }
                }
            ]
        },
        questions: require('./questions.js'),
        solution: {
            title: "Task solution",
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
                            selector: "#solution"
                        }
                    }
                }
            ]
        }
    },
    required: ["taskMetaData", "quiz_settings", "title", "intro", "questions"],
    languages: {
        list: {
            en: "English",
            fr: "French",
            fa: "فارسی"
        },
        rtl: ["fa"],
        original: "en"
    },

    definitions: {
        question_single: require('./question_types/question_single.js'),
        question_multiple: require('./question_types/question_multiple.js'),
        question_input: require('./question_types/question_input.js'),
        question_fill_gaps: require('./question_types/question_fill_gaps.js'),
        group_key: require('./group_key.js'),
    }
};
