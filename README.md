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



# schema.json generator prop

**Common syntax**
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
            "modifier": "images_src" // optinal, set input modifier
        },
        "output": {
            "inject": { // optinal, inject data into teplate, find place by selector
                "template": "index.html"
                "selector": "#data"
            },
            "copy": "destination" // optional, copy and rename file(s) to destination
        }
    }
],
```

**Scope**
Each node have own scope, it node scope = parent node scope + vars defined in node rules


**Conditions**
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

**Input modifiers**
Extract src attribute from image tags:
```
"input": {
    "modifier": "images_src"
}
```

** Output **
Can have "inject" or/and "copy"  props.


**Inject data to html**
Selector syntax based on jQuery selectors syntax + ability to define JS variable, for example:
```
"output": {
    "inject": {
        "template": "test.html",
        "selector": "#script-wrapper>script $single_text"
    }
}
```

**Inject data to json**
Dot-notation selector syntax, arrays not supported
```
"output": {
    "inject": {
        "template": "test.json",
        "selector": "prop1.prop2"
    }
}
```


**Copy file(s)**
Placeholders supported. Scope vars + files specific vars [name] [ext] [index]
```
"output": {
    "copy": "[scope_var]/[name][ext]"
}
```

**Post processor**
Post processor placeholders may be used in templates and task data.

Currently one placeholder supported:
%%TASK_PATH%% - relative path to task
