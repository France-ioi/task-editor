module.exports = {
    type: "object",
    title: "Task meta-data",
    properties: {
        id: {
            type: "string",
            description:
                "Unique identifier for the task; we generally use the path in the SVN.",
            title: "id",
            minLength: "5",
            options: {
                value_source: 'svn.path'
            }
        },
        license: {
            type: "string",
            title: "License",
            enum: ["", "CC-BY-SA", "CC-BY-NC"]
        },
        authors: {
            type: "array",
            title: "Authors",
            items: {
                type: "string"
            }
        },
        language: {
            type: "string",
            description:
                'Language for the task. If you want to have this task in multiple languages, copy the "index.html" file generated by this editor to another file "index_en.html" (for instance), and edit it manually.',
            enum: ["fr", "en", "de"]
        },
        version: {
            type: "string",
            title: "Version"
        },
        translators: {
            type: "array",
            title: "Translators",
            items: {
                type: "string"
            }
        }
    },
    required: ["id", "authors", "language"],
    generator: [
        {
            output: {
                inject: {
                    template: "index.html",
                    selector: "$json"
                }
            }
        }
    ]
}