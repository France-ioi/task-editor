module.exports = {
    title: "Test files",
    description:
        "Tests, consisting in an input and an optional expected output, the solution will be tested against. A basic task may only consist in input and expected output files.",
    type: "array",
    items: {
        type: "object",
        description:
            'Click "Object Properties" to add an expected output file as well.',
        properties: {
            input: {
                type: "string",
                description: "Input file",
                format: "url",
                options: {
                    editor: true,
                    upload: true
                },
                generator: [
                    {
                        output: {
                            copy: "tests/files/test[index].in"
                        }
                    }
                ]
            },
            output: {
                type: "string",
                description: "Output file (optional)",
                format: "url",
                options: {
                    editor: true,
                    upload: true
                },
                generator: [
                    {
                        output: {
                            copy: "tests/files/test[index].out"
                        }
                    }
                ]
            }
        },
        required: ["input"]
    }
};
