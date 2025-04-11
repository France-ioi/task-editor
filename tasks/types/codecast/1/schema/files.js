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
            inputfile: {
                type: "string",
                description: "File",
                format: "url",
                options: {
                    editor: true,
                    upload: true
                },
                generator: [
                    {
                        output: {
                            copy: "[name][ext]"
                        }
                    }
                ]
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
            "inputfile"
        ]
    }
};
