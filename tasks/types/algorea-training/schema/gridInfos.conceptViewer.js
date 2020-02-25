module.exports = {
    title: "conceptViewer",
    oneOf: [
        {
            title: "Boolean value",
            type: "boolean",
            format: "checkbox",
            display_in_parent: true
        },
        {
            title: "Array value",
            type: "array",
            items: {
                type: "string",
                enum: ["extra_list", "extra_function", "extra_variable", "extra_nested_repeat"]
            }
        }
    ]
}