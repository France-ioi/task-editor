module.exports = {
    type: "object",
    title: "Video data",
    description: "Video meta-data, describing the video and its sections.",
    properties: {
        video_id: {
            type: "string",
            description:
                "YouTube ID for the video ; for instance, for https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.",
            title: "id",
            minLength: "5"
        },
        show_viewed: {
            type: "boolean",
            description: "Display which sections have been viewed by the user."
        },
        sections: {
            type: "array",
            description: "Array describing the various sections of the video.",
            items: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "Title of the section."
                    },
                    description: {
                        type: "string",
                        description: "Description of the section."
                    },
                    start: {
                        type: "number",
                        description:
                            "Timestamp of the beginning of the section, in seconds."
                    },
                    end: {
                        type: "number",
                        description:
                            "Timestamp of the end of the section, in seconds."
                    },
                    parts: {
                        type: "integer",
                        description:
                            "Number of parts of the section. The section will be divided in equal parts, and the user will be considered as having watched this section if they hit at least half of these parts. Put 2 or less to consider the user watched the video as soon as they hit the section, put 3 or more to start checking the user viewed at least half."
                    }
                },
                required: ["title", "description", "start", "end", "parts"]
            }
        },
        youtube: {
            type: "object",
            description: "Options for the YouTube player.",
            properties: {
                rel: {
                    type: "integer",
                    description: "Show related videos",
                    enum: [0, 1]
                },
                autoplay: {
                    type: "integer",
                    description: "Automatically start the video",
                    enum: [0, 1]
                },
                start: {
                    type: "integer",
                    description:
                        "Timestamp at which the video will start, in seconds."
                },
                end: {
                    type: "integer",
                    description:
                        "Timestamp at which the video will end, in seconds."
                },
                hl: {
                    type: "string",
                    description: "Force this language in the player."
                }
            },
            required: []
        }
    },
    required: ["video_id", "show_viewed", "sections", "youtube"],
    generator: [
        {
            output: {
                inject: {
                    template: "index.html",
                    selector: "$videoData"
                }
            }
        }
    ]
};
