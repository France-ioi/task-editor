module.exports = {
    title: "Question",
    type: "object",
    required: ["text", "correct_answer", "format", "validator"],
    properties: {
        text: {
            title: "Question text",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            }
        },
        format: {
            title: "Answer input format",
            description:
                "This controls the client-side validation of the answer, and will display a warning to the user if their answer is not in the expected format. Do not use it to check the answer!",
            type: "string",
            enum: ["string", "number", "regexp"]
        },
        validator: {
            title:
                "Answer input validator regexp (optional param for regexp input type)",
            description:
                "RegExps are interpreted by JavaScript. Enter it either as a string which will be passed to the RegExp constructor (^ab+$), either as a RegExp in JS syntax (/^ab+$/i).",
            type: "string"
        },
        correct_answer: {
            title: "Correct answer",
            type: "object",
            required: ["type", "value"],
            properties: {
                type: {
                    title: "Type",
                    type: "string",
                    enum: ["value", "function"]
                },
                value: {
                    title:
                        "Value or JS function (according to selected type)",
                    description:
                        "If function is selected, enter a function which takes as sole argument the user's answer, and returns either a boolean which is true if the answer is right, either an object {score: [float between 0 and 1], message: [string]} to display a message to the user.",
                    type: "string",
                    format: "textarea",
                    options: {
                        input_height: "100px"
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