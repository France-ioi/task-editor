import HTMLEditor from './wysiwyg/html'
import { $extend, $each, $isplainobject, $trigger, $triggerc } from '../utils'
import converter from '../../showdown_converter'

JSONEditor.defaults.editors.string = JSONEditor.TaskEditorAbstractEditor.extend({
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  setValue: function(value,initial,from_template) {
    var self = this;
    if(this.template && !from_template) {
      return;
    }

    if(value === null || typeof value === 'undefined') value = "";
    else if(typeof value === "object") value = JSON.stringify(value);
    else if(typeof value !== "string") value = ""+value;

    this.setEqualHeigths();
    if(value === this.serialized) return;

    // Sanitize value before setting it
    var sanitized = this.sanitize(value);

    if(this.input.value === sanitized) {
      return;
    }

    this.input.value = sanitized;

    this.html_editor && this.html_editor.setContent(sanitized)

    var changed = from_template || this.getValue() !== value;

    this.refreshValue();

    if(initial) this.is_dirty = false;
    else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

    if(this.adjust_height) this.adjust_height(this.input);

    // Bubble this setValue to parents if the value changed
    this.onChange(changed);
  },
  getNumColumns: function() {
    var min = Math.ceil(Math.max(this.getTitle().length,this.schema.maxLength||0,this.schema.minLength||0)/5);
    var num;

    if(this.input_type === 'textarea') num = 6;
    else if(['text','email'].indexOf(this.input_type) >= 0) num = 4;
    else num = 2;

    return Math.min(12,Math.max(min,num));
  },
  build: function() {
    this.afterInputReadyLocked = false;
    this.afterInputReadyCalled = false;

    var self = this, i;
    if (!this.options.compact) this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    if(this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);

    this.format = this.schema.format;
    if(!this.format && this.schema.media && this.schema.media.type) {
      this.format = this.schema.media.type.replace(/(^(application|text)\/(x-)?(script\.)?)|(-source$)/g,'');
    }
    if(!this.format && this.options.default_format) {
      this.format = this.options.default_format;
    }
    if(this.options.format) {
      this.format = this.options.format;
    }

    this.string_type = (this.schema.type === 'integer' || this.schema.type === 'number') ? 'integer' : 'text';

    // Specific format
    if(this.format || this.schema.type === 'multitext') {
      // Text Area
      if(this.format === 'textarea') {
        this.input_type = 'textarea';
        this.input = this.theme.getTextareaInput();
      }
      // Range Input
      else if(this.format === 'range') {
        this.input_type = 'range';
        var min = this.schema.minimum || 0;
        var max = this.schema.maximum || Math.max(100,min+1);
        var step = 1;
        if(this.schema.multipleOf) {
          if(min%this.schema.multipleOf) min = Math.ceil(min/this.schema.multipleOf)*this.schema.multipleOf;
          if(max%this.schema.multipleOf) max = Math.floor(max/this.schema.multipleOf)*this.schema.multipleOf;
          step = this.schema.multipleOf;
        }

        this.input = this.theme.getRangeInput(min,max,step);
      }
      // Source Code
      else if([
          'actionscript',
          'batchfile',
          'bbcode',
          'c',
          'c++',
          'cpp',
          'coffee',
          'csharp',
          'css',
          'dart',
          'django',
          'ejs',
          'erlang',
          'golang',
          'groovy',
          'handlebars',
          'haskell',
          'haxe',
          'html',
          'ini',
          'jade',
          'java',
          'javascript',
          'json',
          'less',
          'lisp',
          'lua',
          'makefile',
          'markdown',
          'matlab',
          'mysql',
          'objectivec',
          'pascal',
          'perl',
          'pgsql',
          'php',
          'python',
          'r',
          'ruby',
          'sass',
          'scala',
          'scss',
          'smarty',
          'sql',
          'stylus',
          'svg',
          'twig',
          'vbscript',
          'xml',
          'yaml'
        ].indexOf(this.format) >= 0 || this.schema.type === 'multitext'
      ) {
        this.input_type = this.format;
        this.source_code = true;

        this.input = this.theme.getExternalInput();
        var enablerInput = this.input.parentNode.children[1];
        enablerInput.addEventListener('click', () => {
          if (this.parent.activateItem) {
            this.parent.activateItem(this);
          } else {
            this.input.parentNode.className = 'external-control active-item';
          }
          this.setEqualHeigths();
          setTimeout(() => self.afterInputReady(true), 0);
        });
        var exitButton = this.input.parentNode.firstChild.lastChild;
        exitButton.addEventListener('click', () => {
          if (this.parent.deactivateItem) {
            this.parent.deactivateItem(this);
          } else {
            this.input.parentNode.className = 'external-control';
          }
          var translate_pair = this.getOtherTranslatePair();
          this.setEqualHeigths();
        });
      }
      // HTML5 Input type
      else {
        this.input_type = this.format;
        this.input = this.theme.getFormInputField(this.input_type, this.string_type);
      }
    }
    // Normal text input
    else {
      this.input_type = 'text';
      this.input = this.theme.getFormInputField(this.input_type, this.string_type);
    }

    this.input.addEventListener('input', () => {
      this.input.setAttribute('size', this.input.value.length || 1);
    });

    // minLength, maxLength, and pattern
    if(typeof this.schema.maxLength !== "undefined") this.input.setAttribute('maxlength',this.schema.maxLength);
    if(typeof this.schema.pattern !== "undefined") this.input.setAttribute('pattern',this.schema.pattern);
    else if(typeof this.schema.minLength !== "undefined") this.input.setAttribute('pattern','.{'+this.schema.minLength+',}');

    if(this.options.compact) {
      this.container.className += ' compact';
    }
    else {
      if(this.options.input_width) this.input.style.width = this.options.input_width;
    }

    if(this.schema.readOnly || this.schema.readonly || this.schema.template) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input
      .addEventListener('change',function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Don't allow changing if this field is a template
        if(self.schema.template) {
          this.value = self.value;
          return;
        }

        var val = this.value;

        // sanitize value
        var sanitized = self.sanitize(val);
        if(val !== sanitized) {
          this.value = sanitized;
        }

        self.is_dirty = true;

        self.refreshValue();
        self.onChange(true);
      });

    if(this.options.input_height) this.input.style.height = this.options.input_height;
    if(this.options.expand_height) {
      this.adjust_height = function(el) {
        if(!el) return;
        var i, ch=el.offsetHeight;
        // Input too short
        if(el.offsetHeight < el.scrollHeight) {
          i=0;
          while(el.offsetHeight < el.scrollHeight+3) {
            if(i>100) break;
            i++;
            ch++;
            el.style.height = ch+'px';
          }
        }
        else {
          i=0;
          while(el.offsetHeight >= el.scrollHeight+3) {
            if(i>100) break;
            i++;
            ch--;
            el.style.height = ch+'px';
          }
          el.style.height = (ch+1)+'px';
        }
      };

      this.input.addEventListener('keyup',function(e) {
        self.adjust_height(this);
      });
      this.input.addEventListener('change',function(e) {
        self.adjust_height(this);
      });
      this.adjust_height();
    }

    if(this.format) this.input.setAttribute('data-schemaformat',this.format);

    this.control = this.theme.getFormControl(this.label, this.input, this.description);
    this.container.appendChild(this.control);

    this.readOnlyView = document.createElement('div');
    this.readOnlyView.className = 'readonly-view';
    if (this.options.wysiwyg) {
      this.readOnlyView.collapsed = true;
      this.readOnlyView.addEventListener('click', () => {
        this.readOnlyView.collapsed = !this.readOnlyView.collapsed;
        if (this.readOnlyView.collapsed) {
          this.readOnlyView.style.height = null;
        } else {
          this.readOnlyView.style.height = 'auto';
        }
        this.setEqualHeigths();
      });
    }
    if (this.options.wysiwyg) this.readOnlyView.className += ' wysiwyg';
    else this.readOnlyView.className += ' string';
    this.control.lastChild.className += ' hide-on-translate-original';
    this.control.appendChild(this.readOnlyView);

    // Any special formatting that needs to happen after the input is added to the dom
    window.requestAnimationFrame(function() {
      // Skip in case the input is only a temporary editor,
      // otherwise, in the case of an ace_editor creation,
      // it will generate an error trying to append it to the missing parentNode
      if(self.input.parentNode) self.afterInputReady();
      if(self.adjust_height) self.adjust_height(self.input);
    });

    // Compile and store the template
    if(this.schema.template) {
      this.template = this.jsoneditor.compileTemplate(this.schema.template, this.template_engine);
      this.refreshValue();
    }
    else {
      this.refreshValue();
    }
  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
      // TODO: WYSIWYG and Markdown editors
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    // TODO: WYSIWYG and Markdown editors
    this._super();
  },
  afterInputReady: function(focus) {
    /* Call Burst Guard Start */
    if (this.afterInputReadyLocked) {
      focus = focus || false;
      this.afterInputReadyCalled = this.afterInputReadyCalled || focus;
      return;
    } else {
      this.afterInputReadyLocked = true;
      this.afterInputReadyCalled = undefined;
      setTimeout(() => {
        this.afterInputReadyLocked = false;
        if (this.afterInputReadyCalled !== undefined) this.afterInputReady(this.afterInputReadyCalled);
      }, 1000);
    }
    /* Call Burst Guard End */

    this.html_editor && this.html_editor.destroy();
    var self = this;
    if(this.options.wysiwyg && ['html','bbcode'].indexOf(this.input_type) >= 0) {
      var root = this;
      while (root.parent) root = root.parent;
      this.html_editor = HTMLEditor({
        element: this.input,
        directionality: root.isRTL ? 'rtl' : 'ltr',
        autoFocus: focus && this.input.id,
        path: this.jsoneditor.options.task.path,
        onChange: function(content) {
          self.input.parentNode.children[1].innerHTML = content;
          self.input.value = content;
          self.value = self.input.value;
          self.is_dirty = true;
          self.refreshValue();
          self.onChange(true);
        },
        onResize: function() {
          self.setEqualHeigths();
        }
      })
    }
    self.theme.afterInputReady(self.input);
  },
  refreshValue: function() {
    this.value = this.input.value;
    this.input.setAttribute('size', this.input.value.length || 1);
    if (this.value_type === 'markdown') this.readOnlyView.innerHTML = converter.makeHtml(this.value) || '[None]';
    else this.readOnlyView.innerHTML = this.value || '[None]';
    if(typeof this.value !== "string") this.value = '';
    this.serialized = this.value;
    (this.html_editor || this.schema.type === 'multitext') && this.setEqualHeigths();
  },
  destroy: function() {
    this.html_editor && this.html_editor.destroy();
    this.template = null;
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);

    this._super();
  },
  /**
   * This is overridden in derivative editors
   */
  sanitize: function(value) {
    return value;
  },
  /**
   * Re-calculates the value if needed
   */
  onWatchedFieldChange: function() {
    var self = this, vars, j;

    // If this editor needs to be rendered by a macro template
    if(this.template) {
      vars = this.getWatchedFieldValues();
      this.setValue(this.template(vars),false,true);
    }

    this._super();
  },
  showValidationErrors: function(errors) {
    var self = this;

    if(this.jsoneditor.options.show_errors === "always") {}
    else if(!this.is_dirty && this.previous_error_setting===this.jsoneditor.options.show_errors) return;

    this.previous_error_setting = this.jsoneditor.options.show_errors;

    var messages = [];
    $each(errors,function(i,error) {
      if(error.path === self.path) {
        messages.push(error.message);
      }
    });

    if(messages.length) {
      this.theme.addInputError(this.input, messages.join('. ')+'.');
    }
    else {
      this.theme.removeInputError(this.input);
    }
  },
  getOtherTranslatePair: function() {
    var original = this.jsoneditor.original_editors[this.path];
    var translate = this.jsoneditor.translate_editors[this.path];
    var my_pair = original === this ? translate : original;
    return my_pair || (this.parent.getOtherTranslatePair && this.parent.getOtherTranslatePair(this));
  },
  setEqualHeigths: function() {
    var translate_pair = this.getOtherTranslatePair();
    if (translate_pair && translate_pair.container) {
      translate_pair.container.className = translate_pair.container.className.replace(/\s*equal-translate-pair/g, '');
      this.container.className = this.container.className.replace(/\s*equal-translate-pair/g, '');
      translate_pair.container.className += ' equal-translate-pair';
      this.container.className += ' equal-translate-pair';

      const setHeight = () => {
        this.container.style.height = null;
        translate_pair.container.style.height = null;
        var maxHeight = Math.max(this.container.offsetHeight, translate_pair.container.offsetHeight);
        if (maxHeight) {
          this.container.style.height = maxHeight + 'px';
          translate_pair.container.style.height = maxHeight + 'px';
        }
      }
      setTimeout(setHeight, 0) && setTimeout(setHeight, 100);
    }
  }
});
