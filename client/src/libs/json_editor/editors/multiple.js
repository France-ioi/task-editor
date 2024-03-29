import { $extend, $each, $isplainobject, $trigger, $triggerc } from '../utils'

// Multiple Editor (for when `type` is an array)
JSONEditor.defaults.editors.multiple = JSONEditor.TaskEditorAbstractEditor.extend({
  register: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].unregister();
      }
      if(this.editors[this.type]) this.editors[this.type].register();
    }
    this._super();
  },
  unregister: function() {
    this._super();
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].unregister();
      }
    }
  },
  getNumColumns: function() {
    if(!this.editors[this.type]) return 4;
    return Math.max(this.editors[this.type].getNumColumns(),4);
  },
  enable: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].enable();
      }
    }
    this.switcher.disabled = false;
    this._super();
  },
  disable: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].disable();
      }
    }
    this.switcher.disabled = true;
    this._super();
  },
  switchEditor: function(i) {
    var self = this;

    if(!this.editors[i]) {
      this.buildChildEditor(i);
    }
    var current_value = self.getValue();

    self.type = i;

    self.register();


    // hide child editor elements if any
    for(var j=0; j<this.title_container.childNodes.length; j++) {
      if(this.title_container.childNodes[j].className.indexOf('form-right-group') !== -1) {
        this.title_container.childNodes[j].style.display = 'none';
      }
    }

    $each(self.editors, function(type,editor) {
      if(!editor) {
        return;
      }
      if (editor.getValue() === null) {
        self.title_container && (self.title_container.style.borderBottom = '1px solid #e3e3e3');
      } else {
        self.title_container && (self.title_container.style.borderBottom = 'none');
      }
      if(self.type === type) {
        if(self.keep_values) {
          editor.setValue(current_value, true);
        }
        self.showChildEditor(type);
      } else {
        editor.container.style.display = 'none';
      }
    });
    self.refreshValue();
    self.refreshHeaderText();
    self.configureCurrentEditorTranslation();
  },

  showChildEditor: function(i) {

      var el = this.getChildEditorElement(i);
      if(el) {
        this.title_container.appendChild(el);
        el.style.display = '';
        this.editors[i].container.style.display = 'none';
      } else {
        this.editors[i].container.style.display = '';
      }

  },


  getChildEditorElement: function(i) {
      var el;
      if('editors' in this.editors[i]) {
        // object
        var subeditors = this.editors[i].editors;
        for(var j in subeditors) {
          if(!subeditors.hasOwnProperty(j)) {
            continue;
          }
          if(subeditors[j].options.schema.display_in_parent) {
            el = subeditors[j].input;
            break;
          }
        }
      } else {
        // single
        if(this.editors[i].schema.display_in_parent) {
          el = this.editors[i].input;
        }
      }
      while (el && (el = el.parentElement) && el.className.indexOf('form-right-group') === -1);
      return el;
  },

  buildChildEditor: function(i) {
    var self = this;
    var type = this.types[i];
    var holder = self.theme.getChildEditorHolder();
    self.editor_holder.appendChild(holder);

    var schema;

    if(typeof type === "string") {
      schema = $extend({},self.schema);
      schema.type = type;
    }
    else {
      schema = $extend({},self.schema,type);
      schema = self.jsoneditor.expandRefs(schema);

      // If we need to merge `required` arrays
      if(type.required && Array.isArray(type.required) && self.schema.required && Array.isArray(self.schema.required)) {
        schema.required = self.schema.required.concat(type.required);
      }
    }

    var editor = self.jsoneditor.getEditorClass(schema);

    self.editors[i] = self.jsoneditor.createEditor(editor,{
      jsoneditor: self.jsoneditor,
      schema: schema,
      container: holder,
      path: self.path,
      parent: self,
      required: true
    });
    self.editors[i].preBuild();
    self.editors[i].build();
    self.editors[i].postBuild();

    self.editors[i].header && (self.editors[i].header.style.display = 'none');
    self.editors[i].description && (self.editors[i].description.style.display = 'none');

    self.editors[i].option = self.switcher_options[i];

    holder.addEventListener('change_header_text',function() {
      self.refreshHeaderText();
    });

    if(i !== self.type) holder.style.display = 'none';
  },

  preBuild: function() {
    var self = this;

    this.types = [];
    this.type = 0;
    this.editors = [];
    this.validators = [];
    this.translating = false;

    this.keep_values = true;
    if(typeof this.jsoneditor.options.keep_oneof_values !== "undefined") this.keep_values = this.jsoneditor.options.keep_oneof_values;
    if(typeof this.options.keep_oneof_values !== "undefined") this.keep_values = this.options.keep_oneof_values;

    if(this.schema.oneOf) {
      this.oneOf = true;
      this.types = this.schema.oneOf;
      delete this.schema.oneOf;
    }
    else if(this.schema.anyOf) {
      this.anyOf = true;
      this.types = this.schema.anyOf;
      delete this.schema.anyOf;
    }
    else {
      if(!this.schema.type || this.schema.type === "any") {
        this.types = ['string','number','integer','boolean','object','array','null'];

        // If any of these primitive types are disallowed
        if(this.schema.disallow) {
          var disallow = this.schema.disallow;
          if(typeof disallow !== 'object' || !(Array.isArray(disallow))) {
            disallow = [disallow];
          }
          var allowed_types = [];
          $each(this.types,function(i,type) {
            if(disallow.indexOf(type) === -1) allowed_types.push(type);
          });
          this.types = allowed_types;
        }
      }
      else if(Array.isArray(this.schema.type)) {
        this.types = this.schema.type;
      }
      else {
        this.types = [this.schema.type];
      }
      delete this.schema.type;
    }

    this.display_text = this.getDisplayText(this.types);
  },
  build: function() {
    var self = this;
    var container = this.container;


    this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    this.switcher = this.theme.getSwitcher(this.display_text);


    var left_group = document.createElement('div');
    left_group.className = 'form-left-group';
    this.header.appendChild(this.switcher);
    left_group.appendChild(this.header);
    this.title_container = this.theme.getMultiField(left_group);      
    
    this.container.appendChild(this.title_container);


    this.switcher.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.switchEditor(self.display_text.indexOf(this.value));
      self.onChange(true);
    });

    this.editor_holder = document.createElement('div');
    this.editor_holder.className += ' no-border';
    container.appendChild(this.editor_holder);

    var validator_options = {};
    if(self.jsoneditor.options.custom_validators) {
      validator_options.custom_validators = self.jsoneditor.options.custom_validators;
    }

    this.switcher_options = this.theme.getSwitcherOptions(this.switcher);
    $each(this.types,function(i,type) {
      self.editors[i] = false;

      var schema;

      if(typeof type === "string") {
        schema = $extend({},self.schema);
        schema.type = type;
      }
      else {
        schema = $extend({},self.schema,type);

        // If we need to merge `required` arrays
        if(type.required && Array.isArray(type.required) && self.schema.required && Array.isArray(self.schema.required)) {
          schema.required = self.schema.required.concat(type.required);
        }
      }

      self.validators[i] = new JSONEditor.Validator(self.jsoneditor,schema,validator_options);
    });

    this.switchEditor(0);
  },
  onChildEditorChange: function(editor) {
    if(this.editors[this.type]) {
      this.refreshValue();
      this.refreshHeaderText();
    }

    this._super();
  },
  refreshHeaderText: function() {
    var display_text = this.getDisplayText(this.types);
    $each(this.switcher_options, function(i,option) {
      option.textContent = display_text[i];
    });
  },
  refreshValue: function() {
    this.value = this.editors[this.type].getValue();
  },
  setValue: function(val,initial) {
    // Determine type by getting the first one that validates
    var self = this;
    $each(this.validators, function(i,validator) {
      if(!validator.validate(val).length) {
        self.type = i;
        self.switcher.value = self.display_text[i];
        return false;
      }
    });

    this.switchEditor(this.type);

    this.editors[this.type].setValue(val,initial);

    this.refreshValue();
    self.onChange();
  },
  destroy: function() {
    $each(this.editors, function(type,editor) {
      if(editor) editor.destroy();
    });
    if(this.editor_holder && this.editor_holder.parentNode) this.editor_holder.parentNode.removeChild(this.editor_holder);
    if(this.switcher && this.switcher.parentNode) this.switcher.parentNode.removeChild(this.switcher);
    this._super();
  },
  showValidationErrors: function(errors) {
    var self = this;

    // oneOf and anyOf error paths need to remove the oneOf[i] part before passing to child editors
    if(this.oneOf || this.anyOf) {
      var check_part = this.oneOf? 'oneOf' : 'anyOf';
      $each(this.editors,function(i,editor) {
        if(!editor) return;
        var check = self.path+'.'+check_part+'['+i+']';
        var new_errors = [];
        $each(errors, function(j,error) {
          if(error.path.substr(0,check.length)===check) {
            var new_error = $extend({},error);
            new_error.path = self.path+new_error.path.substr(check.length);
            new_errors.push(new_error);
          }
        });

        editor.showValidationErrors(new_errors);
      });
    }
    else {
      $each(this.editors,function(type,editor) {
        if(!editor) return;
        editor.showValidationErrors(errors);
      });
    }
  },
  enableTranslation: function() {
    this.translating = true;
    this.switcher.disabled = true;
    this.configureCurrentEditorTranslation();
  },
  disableTranslation: function() {
    this.translating = false;
    this.switcher.disabled = false;
    this.configureCurrentEditorTranslation();
  },
  configureCurrentEditorTranslation: function() {
    var cur_editor = this.editors[this.type];
    if (this.translating) {
      cur_editor.enableTranslation && cur_editor.enableTranslation();
    } else {
      cur_editor.disableTranslation && cur_editor.disableTranslation();
    }
  },
  getOtherTranslatePair: function(item) {
    var original = this.jsoneditor.original_editors[this.path];
    if (original) original = original.editors[original.type];
    var translate = this.jsoneditor.translate_editors[this.path];
    if (translate) translate = translate.editors[translate.type]
    return original === item ? translate : original;
  },
  setCurrentTranslation: function(obj) {
    var cur_editor = this.editors[this.type];
    cur_editor.setCurrentTranslation && cur_editor.setCurrentTranslation(obj);
  },
});
