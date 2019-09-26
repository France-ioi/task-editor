module.exports = {
    "title": "Task",
    "type": "object",
    "description": "This editor allows you to edit the various aspects of a task. All the data in this editor is organized as a JSON object, whose properties represent each task part.",
    "definitions": require('./definitions.js'),

    "properties": {
      "files": require('./files.js'),
      "PEMTaskMetaData": require('./PEMTaskMetaData.js'),
      "FIOITaskMetaData": require('./FIOITaskMetaData.js'),
      "title": {
        "type": "string",
        "description": "Title of the task.",
        "title": "Title",
        "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "title"
                }}
            }]
      },
      "task": {
         "title": "Task statement",
         "description": "Task statement, displayed to the user.",
         "type": "string",
         "format": "html",
         "options": {
           "wysiwyg": true
         },
         "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "#task"
                }}
            }]
      },
      "solution": {
         "title": "Solution",
         "description": "Task solution, displayed to the user when they complete the task.",
         "type": "string",
         "format": "html",
         "options": {
           "wysiwyg": true
         },
         "generator": [{
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": "#solution"
                }}
            }]
      },
      "hints": {
        "type": "array",
        "description": "Hints the user can request automatically; each request will give one new hint.",
        "format": "tabs",
        "title": "Hints",
        "items": {
          "title": "Hint",
          "type": "string",
          "format": "html",
          "options": {
            "wysiwyg": true
          }
        },
        "generator": [{
            "input": {
                "keepArray": true
            },
            "output": {
                "inject": {
                    "template": "index.html",
                    "selector": ".hint"
                }}
            }]
      },
      "testFiles": require('./testFiles.js'),
      "taskSettings": require('./taskSettings.js')
    },

    "required": ["PEMTaskMetaData", "FIOITaskMetaData", "title", "task", "solution", "testFiles"],
    "translate": ["PEMTaskMetaData", "FIOITaskMetaData", "title", "task", "solution", "testFiles"],
    "advanced": ["taskSettings"],
    "languages": {
      "list": {
        "en": "English",
        "fr": "French",
        "fa": "فارسی"
      },
      "rtl": ["fa"],
      "original": "en"
    }
}
