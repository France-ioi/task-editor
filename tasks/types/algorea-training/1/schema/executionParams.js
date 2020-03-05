module.exports = {
    type: "object",
    description: "Parameters of an execution.",
    properties: {
        timeLimitMs: {
            type: "integer",
            description: "Time limit in milliseconds."
        },
        memoryLimitKb: {
            type: "integer",
            description: "Memory limit in kilobytes."
        },
        useCache: {
            type: "boolean",
            description: "Use taskgrader's cached items."
        },
        executionArgs: {
            type: "string",
            description:
                "Command-line arguments for the execution of the program."
        },
        forceStatic: {
            type: "boolean",
            description: "If present, force static or non-static compilation."
        },
        continueOnError: {
            type: "boolean",
            description: "Consider errors as non-fatal."
        },
        stdoutTruncateKb: {
            type: "integer",
            description:
                "Size in kilobytes to capture from stdout, -1 means no limit."
        },
        stderrTruncateKb: {
            type: "integer",
            description:
                "Size in kilobytes to capture from stderr, -1 means no limit."
        },
        addFiles: {
            type: "array",
            description: "Files to add to the execution folder.",
            items: {
                $ref: "#/definitions/fileDescr"
            }
        },
        getFiles: {
            type: "array",
            description: "Files to capture in the report.",
            items: {
                $ref: "#/definitions/filename"
            }
        }
    },
    required: [
        "timeLimitMs",
        "memoryLimitKb",
        "useCache",
        "stdoutTruncateKb",
        "stderrTruncateKb",
        "getFiles"
    ]
};
