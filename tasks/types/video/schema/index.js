module.exports = {
    "title": "Video Task",
    "type": "object",
    "description": "You can generate here a \"video task\", which is a course with an embedded YouTube video. It will display the video and sections, allowing an user to find easily",

    "properties": {
      "taskMetaData": require('./taskMetaData.js'),
      "title": {
        "type": "string",
        "title": "Task title",
         "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "title"
                }}}, {
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "#tasktitle"
                }}}
            ]
      },
      "taskpre": {
         "title": "Statement, before video",
         "description": "Task statement, displayed to the user before the video.",
         "type": "string",
         "format": "html",
         "options": {
           "wysiwyg": true
         },
         "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "#taskpre"
                }}
            }]
      },
      "taskpost": {
         "title": "Statement, after video",
         "description": "Task statement, displayed to the user after the video.",
         "type": "string",
         "format": "html",
         "options": {
           "wysiwyg": true
         },
         "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "#taskpost"
                }}
            }]
      },
      "videoData": require('./videoData.js')
    },

    "required": ["taskMetaData", "title", "taskpre", "taskpost", "videoData"]
}