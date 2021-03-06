module.exports = {
    title: "Task",
    type: "object",
    required: ["text"],
    advanced: ["texts"],
    definitions: {
        text_editor: {
            title: "Test text editor",
            type: "string",
            format: "html",
            options: {
                wysiwyg: true
            }
        },
        file_upload: {
            type: "string",
            format: "url",
            options: {
                upload: true,
                editor: true
            }
        }
    },
    generator: [
        {
            scope: {
                test_var: "22",
                scope_file_prefix: "aaa_"
            }
        }
    ],
    properties: {
        text: {
            $ref: "#/definitions/text_editor",
            options: {
                wysiwyg: true
            },
            generator: [
                {
                    condition: {
                        test_var: "22"
                    },
                    output: {
                        inject: {
                            template: "test.html",
                            selector: ".text-single"
                        }
                    }
                },
                {
                    output: {
                        inject: {
                            template: "test.html",
                            selector: "#script-wrapper>script $single_text"
                        }
                    }
                },
                {
                    condition: {
                        test_var: null
                    },
                    output: {
                        inject: {
                            template: "test.html",
                            selector: "#script-wrapper>script $empty_var"
                        }
                    }
                },
                {
                    input: {
                        modifier: "images_src"
                    },
                    output: {
                        inject: {
                            template: "single_text_images.json"
                        }
                    }
                }
            ]
        },
        texts: {
            type: "array",
            format: "tabs",
            title: "Multiple texts",
            generator: [
                {
                    output: {
                        inject: {
                            template: "test.html",
                            selector: ".text-multiple"
                        }
                    }
                }
            ],
            items: {
                $ref: "#/definitions/text_editor"
            }
        },
        test_files: {
            title: "Test files upload",
            type: "object",
            properties: {
                single: {
                    title: "Single file test",
                    $ref: "#/definitions/file_upload",
                    generator: [
                        {
                            output: {
                                copy: "test_dir1/[scope_file_prefix][name][ext]"
                            }
                        }
                    ]
                },
                multiple: {
                    type: "array",
                    format: "tabs",
                    title: "Multiple files",
                    items: {
                        $ref: "#/definitions/file_upload"
                    },
                    generator: [
                        {
                            output: {
                                copy:
                                    "test_dir2/[scope_file_prefix][index][ext]"
                            }
                        }
                    ]
                }
            }
        }
    },
    languages: {
        list: {
            en: "English",
            fr: "French",
            fa: "فارسی"
        },
        rtl: ["fa"],
        original: "en"
    }
};
