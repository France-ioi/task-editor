JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.type === 'boolean') return 'boolean'
});

JSONEditor.defaults.languages.en.yes = 'Yes';
JSONEditor.defaults.languages.en.no = 'No';

JSONEditor.defaults.editors.boolean = JSONEditor.TaskEditorAbstractEditor.extend({
  setValue: function(value,initial) {
    this.value = !!value;
    this.input.children[0].className = this.input.children[0].className.replace(/\s*active/g, '');
    this.input.children[1].className = this.input.children[1].className.replace(/\s*active/g, '');
    this.input.children[this.value ? 1 : 0].className += ' active';
    this.readOnlyView.innerHTML = this.value === true ? 'YES' : (this.value === false ? 'NO' : '[None]');
    this.onChange();
  },
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
  getNumColumns: function() {
    return Math.min(12,Math.max(this.getTitle().length/7,2));
  },
  build: function() {
    var self = this;
    if(!this.options.compact) {
      this.label = this.header = this.theme.getFormInputLabel(this.getTitle());
    }
    if(this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);
    if(this.options.compact) this.container.className += ' compact';

    this.input = this.theme.getBoolean([this.translate('no'), this.translate('yes')]);
    this.control = this.theme.getFormControl(this.label, this.input, this.description);

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.children[0].addEventListener('click', function() {
      self.setValue(false);
      self.onChange(true);
    });
    this.input.children[1].addEventListener('click', function() {
      self.setValue(true);
      self.onChange(true);
    });

    this.container.appendChild(this.control);
    this.readOnlyView = document.createElement('div');
    this.readOnlyView.className = 'boolean readonly-view';
    this.control.lastChild.className += ' hide-on-translate-original';
    this.control.appendChild(this.readOnlyView);
  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    this._super();
  },
  destroy: function() {
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    this._super();
  }
});
