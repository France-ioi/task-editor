module.exports = {
    type: "object",
    description: "Description of the files required to compile a program.",
    properties: {
        language: {
            type: "string",
            description:
                "Language of the program. Possible values: 'c', 'cpp', 'cpp11', 'ml', 'ocaml', 'java', 'javascool', 'js', 'sh', 'shell', 'pascal', 'php'', 'py', 'py2', 'py3', 'python', 'python2', 'python3'."
        },
        files: {
            type: "array",
            description: "List of source files.",
            items: {
                $ref: "#/definitions/fileDescr"
            }
        },
        dependencies: {
            type: "array",
            description: "List of dependencies.",
            items: {
                $ref: "#/definitions/fileDescr"
            }
        }
    },
    required: ["language", "files", "dependencies"]
};
