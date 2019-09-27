# task-editor
A visual editor to create tasks of all kinds

Install
```sh
npm install
```

Start in dev mode
```sh
npm run dev
```

Start in production mode
```sh
npm run build
npm run start
```



## schema.json generator prop

### Common syntax
```
"generator": [ // optional, array of rules

    {  // rule
        "scope": { // optional, set variables in node scope
            "test_var": "22",
            "scope_file_prefix": "aaa_"
        },
        "condition": { // optional, rule will be executed if node scope satisfy the conditions
            "var1": "1",
            "var2": null
        },
        "input": { // optional
            "modifier": "images_src" // optional, set input modifier
        },
        "output": {
            "inject": { // optional, inject data into teplate, find place by selector
                "template": "index.html"
                "selector": "#data"
            },
            "copy": "destination" // optional, copy and rename file(s) to destination
        }
    }
],
```

## Scope
Each node have own scope, it node scope = parent node scope + vars defined in node rules


## Conditions
Execute rule only if scope var "var1" equal to "1"
```
"condition": {
    "var1": "1"
},
```

Execute rule only if scope var "test_var" not defined in scope
```
"condition": {
    "var1": null
},
```

## Input
Optinal prop. If not defined then raw task data come to output.

Extract src attribute from image tags:
```
"input": {
    "modifier": "images_src"
}
```

### Output
Can have "inject" or/and "copy"  props.


#### Inject data to html
Selector syntax based on jQuery selectors syntax + ability to define JS variable, for example:
```
"output": {
    "inject": {
        "template": "test.html",
        "selector": "#script-wrapper>script $single_text"
    }
}
```
Make sure your template supports both RTL and LTR contents.

#### Inject data to json
Dot-notation selector syntax, arrays not supported
```
"output": {
    "inject": {
        "template": "test.json",
        "selector": "prop1.prop2"
    }
}
```
In addition to "template" and "selector", you can specify a "translate" boolean property to each inject specifying whether it should be translated for different languages or not. The d efault value is true.


#### Copy file(s)
Placeholders supported. Scope vars + files specific vars [name] [ext] [index]
```
"output": {
    "copy": "[scope_var]/[name][ext]"
}
```

## Advanced Section
Specify advanced fields of each object like this:
```
"advanced": ["taskSettings"]
```

## Translation
Translation supported. Add languages object to the top-level schema. Original must be specified. rtl is optional and adds rtl editors for those languages.
```
"languages": {
    "list": {
        "en": "English",
        "fr": "French",
        "de": "Dutch",
        "fa": "فارسی"
    },
    "rtl": ["fa"],
    "original": "en"
}
```

For each object, you can specify which fields can be translated using the translate property:
```
"translate": ["PEMTaskMetaData", "FIOITaskMetaData", "title", "task", "solution", "testFiles"]
```

## Post processor
Post processor placeholders may be used in templates and task data.

#### Placeholders supported :
```
%%TASK_PATH%% (relative path to task)
%%LANG_DIR%%  (Either rtl or ltr based on the language)
```
