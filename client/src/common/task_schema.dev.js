export default {
    "title": "Task",
    "type": "object",
    "properties": {

      "test_files": {
        "title": "Test files upload",
        "type": "object",
        "properties": {
          "single": {
            "title": "Single file test",
            "type": "string",
            "format": "url",
            "options": {
              "upload": true
            },
            "links": [
              {
                "href": "{{self}}",
                "class": "json-file-link"
              }
            ]
          },
          "multiple": {
            "type": "array",
            "format": "tabs",
            "title": "Multiple files test",
            "items": {
              "title": "File",
              "type": "string",
              "format": "url",
              "options": {
                "upload": true
              },
              "links": [
                {
                  "href": "{{self}}",
                  "class": "json-file-link"
                }
              ]
            }
          },
        }
      },


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
                  "options": {
                    "layout": "grid"
                  },
                  "properties": {
                    "language": {
                       "title": "Language",
                       "type": "string",
                       "enum": ["*", "cpp", "c", "java", "py"],
                       "options": {
                        "grid_columns": 6
                       }
                    },
                    "time": {
                       "title": "Time (ms)",
                       "type": "string",
                       "options": {
                        "grid_columns": 3
                       }
                    },
                    "memory": {
                       "title": "Memory (KB)",
                       "type": "string",
                       "options": {
                        "grid_columns": 3
                       }
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
                  "type": "string",
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