module.exports = {
    type: "object",
    description: "Meta-data specific to task.gridInfos",
    properties: {
        context: {
            type: "string",
            title: "Context type",
            default: 'printer',
        },
        conceptViewer: {
            type: "boolean",
            title: "Enable documentation",
        },
        allowClientExecution: {
            type: "boolean",
            description:
              'Allow the user to run their program client-side',
            title: "Allow client execution",
        },
    },
    generator: [
        {
            input: {
                collector: 'collectors/gridInfos.js'
            },
            output: {
                inject: {
                    template: "index.html",
                    selector: "$GridInfos"
                }
            }
        }
    ]
};
