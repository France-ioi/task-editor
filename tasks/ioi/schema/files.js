module.exports = {
    type: "array",
    format: "tabs",
    title: "Files",
    description: "Extra files to place in the task folder.",
    uniqueItems: true,
    items: {
        type: "object",
        title: "File",
        properties: {
            path: {
                type: "string",
                title: "Path"
            },
            type: {
                type: "string",
                title: "Type",
                enum: ["image", "testCase", "solution"]
            },
            description: {
                type: "string",
                title: "Description"
            },
            usedInStatement: {
                type: "boolean",
                format: "checkbox",
                title: "Used in statement"
            },
            usedInSolution: {
                type: "boolean",
                format: "checkbox",
                title: "Used in solution"
            },
            usedInHints: {
                type: "boolean",
                format: "checkbox",
                title: "Used in hints"
            }
        },
        required: [
            "path",
            "type",
            "description",
            "usedInStatement",
            "usedInSolution",
            "usedInHints"
        ]
    }
};
