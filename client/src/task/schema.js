export default {
    "title": "Task",
    "type": "object",
    "properties": {
      "files": {
        "type": "array",
        "format": "tabs",
        "title": "Files",
        "uniqueItems": true,
        "items": {
          "type": "object",
          "title": "File",
          "properties": {
              "path": {
                 "type": "string",
                 "title": "Path"
               },
               "type": {
                 "type": "string",
                 "title": "Type",
             "enum": ["image", "testCase", "solution"]
               },
               "description": {
                 "type": "string",
                 "title": "Description"
               },
               "usedInStatement": {
                 "type": "boolean",
             "format": "checkbox",
                 "title": "Used in statement"
               },
               "usedInSolution": {
                 "type": "boolean",
             "format": "checkbox",
                 "title": "Used in solution"
               },
               "usedInHints": {
                 "type": "boolean",
             "format": "checkbox",
                 "title": "Used in hints"
               }
           }
        }
      },
      "PEMTaskMetaData": {
         "type": "object",
         "properties": {
            "id": {
              "type": "string",
              "title": "id"
            },
            "license": {
              "type": "string",
              "title": "license",
              "enum": ["CC-BY-SA", "CC-BY-NC"]
            },
            "authors": {
              "type": "array",
              "format": "tabs",
              "title": "Hints",
              "items": {
                "title": "Hint",
                "type": "string",
                "format": "html",
                "options": {
                  "wysiwyg": true
                }
              }
            },
            "language": {
              "type": "string",
              "title": "license",
              "enum": ["fr", "en", "de"]
            },
            "version": {
              "type": "string",
              "title": "version"
            },
            "baseUrl": {
              "type": "string",
              "title": "baseUrl"
            },
            "limits": {
              "type": "array",
              "format": "tabs",
              "title": "Limits",
              "items": {
                 "type": "object",
                 "properties": {
                    "language": {
                       "title": "Language",
                       "type": "string",
                       "enum": ["*", "cpp", "c", "java", "py"]
                    },
                    "time": {
                       "title": "Time (ms)",
                       "type": "string"
                    },
                    "memory": {
                       "title": "Memory (KB)",
                       "type": "string"
                    }
                 }
              }
            }
         }
      },
      "FIOITaskMetaData": {
         "type": "object",
         "properties": {
            "supportedLanguages": {
               "type": "array",
               "items": {
                  "types": "string",
                  "title": "supportedLanguage",
                  "enum": ["c", "cpp", "java", "py"]
               }
            },
            "hasUserTests": {
               "type": "boolean",
               "title": "User can create tests"
            }
         }
      },
      "title": {
        "type": "string",
        "title": "Title"
      },
      "task": {
         "title": "Task statement",
         "type": "string",
         "format": "html",
         "options": {
           "wysiwyg": true
         }
      },
      "solution": {
         "title": "Solution",
         "type": "string",
         "format": "c++",
         "options": {
           "wysiwyg": true
         }
      },
      "hints": {
        "type": "array",
        "format": "tabs",
        "title": "Hints",
        "items": {
          "title": "Hint",
          "type": "string",
          "format": "html",
          "options": {
            "wysiwyg": true
          }
        }
      }
    }
  }