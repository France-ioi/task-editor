module.exports = {
    type: "object",
    description: "Meta-data specific to taskplatform tasks.",
    properties: {
        LanguageModules: {
            type: "string",
            title: "Language",
            enum: ["blockly", "python"],
            generator: [
                {
                    output: {
                        inject: {
                            template: "index.html",
                            selector: "$languageModules"
                        }
                    }
                }
            ]
        }
    },
    required: ["LanguageModules"]
};