module.exports = {
    title: "Fill in the gaps",
    type: "object",
    required: ["text", "answers", "non_answers", "fill_gaps_text"],
    id: "question_fill_gaps",
    properties: {
        text: {
            title: "Question text",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            }
        },
        fill_gaps_text: {
            title: "Fill in the gaps text",
            description:
                'Use <span class="glyphicon glyphicon-unchecked"></span> button to insert placeholders.',
            type: "string",
            format: "html",
            options: {
                wysiwyg: true,
                placeholder: true
            }
        },
        answers: {
            title: "Correct words",
            type: "array",
            format: "tabs",
            items: {
                headerTemplate: "Word #{{i}}",
                type: "string"
            }
        },
        non_answers: {
            title: "Incorrect words",
            type: "array",
            format: "tabs",
            items: {
                headerTemplate: "Word #{{i}}",
                type: "string"
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