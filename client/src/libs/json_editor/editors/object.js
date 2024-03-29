import { $extend, $each, $isplainobject, $trigger, $triggerc } from '../utils'

JSONEditor.defaults.editors.object = JSONEditor.TaskEditorAbstractEditor.extend({
  getDefault: function() {
    return $extend({},this.schema["default"] || {});
  },
  getChildEditors: function() {
    return this.editors;
  },
  register: function() {
    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].register();
      }
    }
  },
  unregister: function() {
    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].unregister();
      }
    }
  },
  getNumColumns: function() {
    return Math.max(Math.min(12,this.maxwidth),3);
  },
  enable: function() {
    if(this.editjson_button) this.editjson_button.disabled = false;
    if(this.addproperty_button) this.addproperty_button.disabled = false;

    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].enable();
      }
    }
  },
  disable: function() {
    if(this.editjson_button) this.editjson_button.disabled = true;
    if(this.addproperty_button) this.addproperty_button.disabled = true;
    this.hideEditJSON();

    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].disable();
      }
    }
  },
  shouldTranslate: function(key) {
    return (this.schema.translate === undefined || this.schema.translate.indexOf(key) !== -1) && Object.keys(this.schema.properties).indexOf(key) !== -1;
  },
  enableTranslation: function() {
    $each(this.editors, (key, editor) => {
      if (key in this.translate_editors) {
        this.theme.setGridColumnSize(editor.container, 6);
        editor.container.className += ' original-field';
        editor.disable();
      }
      if (!this.shouldTranslate(key)) {
        editor.container.className += ' no-translate';
      } else if (editor.enableTranslation) editor.enableTranslation();
    });
    this.sections['optional'] && this.sections['optional'].lastChild.collapsed && this.sections['optional'].firstChild.click();
    this.sections['advanced'] && this.sections['advanced'].lastChild.collapsed && this.sections['advanced'].firstChild.click();
  },
  disableTranslation: function() {
    $each(this.editors, (key, editor) => {
      if (key in this.translate_editors) {
        this.theme.setGridColumnSize(editor.container, 12);
        editor.container.className = editor.container.className.replace(/\s*original-field/g, '');
        editor.enable();
      }
      if (!this.shouldTranslate(key)) {
        editor.container.className = editor.container.className.replace(/\s*no-translate/g, '');
      } else if (editor.disableTranslation) editor.disableTranslation();
    });
    this.sections['optional'] && this.sections['optional'].lastChild.collapsed && this.sections['optional'].firstChild.click();
    this.sections['advanced'] && !this.sections['advanced'].lastChild.collapsed && this.sections['advanced'].firstChild.click();
    if (!this.parent) this.jsoneditor.options.translations = this.getTranslations();
  },
  getCurrentTranslation: function() {
    var translation = {};
    $each(this.editors, (key, editor) => {
      if (key in this.translate_editors) translation[key] = this.translate_editors[key].getValue();
      else if (this.shouldTranslate(key) && editor.getCurrentTranslation) translation[key] = editor.getCurrentTranslation();
    });
    this.filterJSON(translation);
    return translation;
  },
  setRTLTranslation: function() {
    this.isRTL = Array.isArray(this.schema.languages.rtl) && this.schema.languages.rtl.indexOf(this.translate_to) > -1;
  },
  reshapeArray: function(arr, orig) {
    if (!orig) return orig
    else if (arr.length === orig.length) return arr
    else if (arr.length > orig.length) return arr.slice(0, orig.length)
    else return arr.concat(orig.slice(arr.length))
  },
  setCurrentTranslation: function(obj) {
    $each(this.editors, (key, editor) => {
      if (Array.isArray(obj[key])) obj[key] = this.reshapeArray(obj[key], this.editors[key].getValue());
      if (key in this.translate_editors) {
        this.translate_editors[key].setValue(obj[key] || this.editors[key].getValue());
        if (this.translate_editors[key].afterInputReady) setTimeout(() => this.translate_editors[key].afterInputReady(), 0);
      } else if (this.shouldTranslate(key) && editor.setCurrentTranslation) editor.setCurrentTranslation(obj[key] || editor.getValue());
    });
  },
  getTranslations: function() {
    var tr = this.jsoneditor.options.translations || {};
    if (this.translate_mode && this.translate_to) tr[this.translate_to] = this.getCurrentTranslation();
    for(var i in tr) {
      if(tr.hasOwnProperty(i) && !(i in this.schema.languages.list)) delete tr[i];
    }
    return tr;
  },
  layoutEditors: function(light) {
    var self = this, i, j;

    if(!this.row_container) return;

    // Sort editors by propertyOrder
    this.property_order = Object.keys(this.editors);
    this.property_order = this.property_order.sort(function(a,b) {
      var ordera = self.editors[a].schema.propertyOrder;
      var orderb = self.editors[b].schema.propertyOrder;
      if(typeof ordera !== "number") ordera = 1000;
      if(typeof orderb !== "number") orderb = 1000;

      return ordera - orderb;
    });

    var container;

    if(this.format === 'grid') {
      var rows = [];
      $each(this.property_order, function(j,key) {
        var editor = self.editors[key];
        if(editor.property_removed) return;
        var found = false;
        var width = editor.options.hidden? 0 : (editor.options.grid_columns || editor.getNumColumns());
        var height = editor.options.hidden? 0 : editor.container.offsetHeight;
        // See if the editor will fit in any of the existing rows first
        for(var i=0; i<rows.length; i++) {
          // If the editor will fit in the row horizontally
          if(rows[i].width + width <= 12) {
            // If the editor is close to the other elements in height
            // i.e. Don't put a really tall editor in an otherwise short row or vice versa
            if(!height || (rows[i].minh*0.5 < height && rows[i].maxh*2 > height)) {
              found = i;
            }
          }
        }

        // If there isn't a spot in any of the existing rows, start a new row
        if(found === false) {
          rows.push({
            width: 0,
            minh: 999999,
            maxh: 0,
            editors: []
          });
          found = rows.length-1;
        }

        rows[found].editors.push({
          key: key,
          //editor: editor,
          width: width,
          height: height
        });
        rows[found].width += width;
        rows[found].minh = Math.min(rows[found].minh,height);
        rows[found].maxh = Math.max(rows[found].maxh,height);
      });

      // Make almost full rows width 12
      // Do this by increasing all editors' sizes proprotionately
      // Any left over space goes to the biggest editor
      // Don't touch rows with a width of 6 or less
      for(i=0; i<rows.length; i++) {
        if(rows[i].width < 12) {
          var biggest = false;
          var new_width = 0;
          for(j=0; j<rows[i].editors.length; j++) {
            if(biggest === false) biggest = j;
            else if(rows[i].editors[j].width > rows[i].editors[biggest].width) biggest = j;
            rows[i].editors[j].width *= 12/rows[i].width;
            rows[i].editors[j].width = Math.floor(rows[i].editors[j].width);
            new_width += rows[i].editors[j].width;
          }
          if(new_width < 12) rows[i].editors[biggest].width += 12-new_width;
          rows[i].width = 12;
        }
      }

      // layout hasn't changed
      if(this.layout === JSON.stringify(rows)) return false;
      this.layout = JSON.stringify(rows);

      // Layout the form
      container = document.createElement('div');
      for(i=0; i<rows.length; i++) {
        var row = this.theme.getGridRow();
        container.appendChild(row);
        for(j=0; j<rows[i].editors.length; j++) {
          var key = rows[i].editors[j].key;
          var editor = this.editors[key];

          if(editor.options.hidden) editor.container.style.display = 'none';
          else this.theme.setGridColumnSize(editor.container,rows[i].editors[j].width);
          row.appendChild(editor.container);
        }
      }
    }
    // Normal layout
    else {
      container = document.createElement('div');
      var required_fields = [], optional_fields = [], advanced_fields = [];
      $each(this.property_order, function(i, key) {
        var editor = self.editors[key];
        if (self.isRequired(editor)) required_fields.push(key)
        else if (self.isAdvanced(editor)) advanced_fields.push(key)
        else optional_fields.push(key)
      });
      $each([required_fields, optional_fields, advanced_fields], function(i, fields) {
        var inner_container = document.createElement('div');
        container.appendChild(inner_container);
        var fields_container = document.createElement('div');
        fields_container.className = 'section-fields-container';
        inner_container.appendChild(fields_container);
        $each(fields, function(f, key) {
          var editor = self.editors[key];
          var translate_editor = self.translate_editors[key];
          if(editor.property_removed) return;
          var row = self.theme.getGridRow();
          fields_container.appendChild(row);

          if(editor.options.hidden) editor.container.style.display = 'none';
          else self.theme.setGridColumnSize(editor.container,12);
          if (translate_editor) {
            self.theme.setGridColumnSize(translate_editor.container, 6);
            translate_editor.container.className += ' translate-field';
          }
          if (fields === required_fields) {
            editor.container.className += ' required-field';
            translate_editor && (translate_editor.container.className += ' required-field');
          } else if (fields === advanced_fields) {
            editor.container.className += ' advanced-field';
            translate_editor && (translate_editor.container.className += ' advanced-field');
          }
          row.appendChild(editor.container);
          if (translate_editor) row.appendChild(translate_editor.container);
          if (!light) {
            editor.afterInputReady && setTimeout(() => editor.afterInputReady(), 0)
            translate_editor && translate_editor.afterInputReady && setTimeout(() => translate_editor.afterInputReady(), 0)
          }
        });
        if (fields !== required_fields && fields.length) {
          var section_type = fields === optional_fields ? 'optional' : 'advanced';
          var section_control = self.theme.getFieldSectionControl(section_type);
          self.sections[section_type] = inner_container;

          inner_container.insertBefore(section_control, inner_container.firstChild);
          fields_container.collapsed = false;
          section_control.addEventListener('click', function() {
            if (fields_container.collapsed) {
              fields_container.collapsed = false;
              fields_container.style.maxHeight = fields_container.scrollHeight + 'px';
              setTimeout(() => { fields_container.style.maxHeight = null; fields_container.style.overflow = null }, 200);
              section_control.children[1].innerHTML = 'HIDE' + section_control.children[1].innerHTML.substr(4);
              section_control.lastChild.className = section_control.lastChild.className.replace(/menu-down/g, 'menu-up');
            } else {
              fields_container.collapsed = true;
              fields_container.style.maxHeight = fields_container.scrollHeight + 'px';
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                  fields_container.style.overflow = 'hidden'; fields_container.style.maxHeight = '0'
                });
              });
              section_control.children[1].innerHTML = 'SHOW' + section_control.children[1].innerHTML.substr(4);
              section_control.lastChild.className = section_control.lastChild.className.replace(/menu-up/g, 'menu-down');
            }
          });
          if (fields === advanced_fields) {
            fields_container.collapsed = true;
            fields_container.style.maxHeight = '0';
            fields_container.style.overflow = 'hidden';
            section_control.children[1].innerHTML = 'SHOW' + section_control.children[1].innerHTML.substr(4);
            section_control.lastChild.className = section_control.lastChild.className.replace(/menu-up/g, 'menu-down');
          }
        }
      });
    }
    this.row_container.innerHTML = '';
    this.row_container.appendChild(container);
  },
  getPropertySchema: function(key) {
    // Schema declared directly in properties
    var schema = this.schema.properties[key] || {};
    schema = $extend({},schema);
    var matched = this.schema.properties[key]? true : false;

    // Any matching patternProperties should be merged in
    if(this.schema.patternProperties) {
      for(var i in this.schema.patternProperties) {
        if(!this.schema.patternProperties.hasOwnProperty(i)) continue;
        var regex = new RegExp(i);
        if(regex.test(key)) {
          schema.allOf = schema.allOf || [];
          schema.allOf.push(this.schema.patternProperties[i]);
          matched = true;
        }
      }
    }

    // Hasn't matched other rules, use additionalProperties schema
    if(!matched && this.schema.additionalProperties && typeof this.schema.additionalProperties === "object") {
      schema = $extend({},this.schema.additionalProperties);
    }

    return schema;
  },
  preBuild: function() {
    this._super();

    this.editors = {};
    this.translate_editors = {};
    this.sections = {};
    this.cached_editors = {};
    this.isRTL = false;
    var self = this;

    this.format = this.options.layout || this.options.object_layout || this.schema.format || this.jsoneditor.options.object_layout || 'normal';
    if (this.format === 'grid') {
      this.format = 'normal';
      this.options.table_row = true;
    }

    this.schema.properties = this.schema.properties || {};

    this.minwidth = 0;
    this.maxwidth = 0;

    // If the object should be rendered as a table row
    if(this.options.table_row) {
      $each(this.schema.properties, function(key,schema) {
        var editor = self.jsoneditor.getEditorClass(schema);
        self.editors[key] = self.jsoneditor.createEditor(editor,{
          jsoneditor: self.jsoneditor,
          schema: schema,
          path: self.path+'.'+key,
          parent: self,
          required: true
        });
        self.editors[key].preBuild();

        var width = self.editors[key].options.hidden? 0 : (self.editors[key].options.grid_columns || self.editors[key].getNumColumns());

        self.minwidth += width;
        self.maxwidth += width;
      });
      this.no_link_holder = true;
    }
    // If the object should be rendered as a table
    else if(this.options.table) {
      // TODO: table display format
      throw "Not supported yet";
    }
    // If the object should be rendered as a div
    else {
      if(!this.schema.defaultProperties) {
        if(this.jsoneditor.options.display_required_only || this.options.display_required_only) {
          this.schema.defaultProperties = [];
          $each(this.schema.properties, function(k,s) {
            if(self.isRequired({key: k, schema: s})) {
              self.schema.defaultProperties.push(k);
            }
          });
        }
        else {
          self.schema.defaultProperties = Object.keys(self.schema.properties);
        }
      }

      // Increase the grid width to account for padding
      self.maxwidth += 1;

      $each(this.schema.defaultProperties, function(i,key) {
        self.addObjectProperty(key, true);

        if(self.editors[key]) {
          self.minwidth = Math.max(self.minwidth,(self.editors[key].options.grid_columns || self.editors[key].getNumColumns()));
          self.maxwidth += (self.editors[key].options.grid_columns || self.editors[key].getNumColumns());
        }
      });

      if (this.jsoneditor.translate_editors === undefined) this.jsoneditor.translate_editors = {}
      if (this.jsoneditor.original_editors === undefined) this.jsoneditor.original_editors = {}
      $each(this.schema.properties, (key, schema) => {
        if (!this.shouldTranslate(key)) return
        var editor = this.jsoneditor.getEditorClass(schema);
        if ((editor !== JSONEditor.defaults.editors.object || (schema.options && schema.options.table_row)) && (editor !== JSONEditor.defaults.editors.array || this.editors[key].isCompressedArray())) {
          this.translate_editors[key] = this.jsoneditor.createEditor(editor, {
            jsoneditor: this.jsoneditor,
            schema: schema,
            path: this.path + '.' + key,
            parent: this
          });
          this.translate_editors[key].preBuild();
          this.jsoneditor.original_editors[this.path + '.' + key] = this.editors[key];
          this.jsoneditor.translate_editors[this.path + '.' + key] = this.translate_editors[key];
        }
      });
    }

    // Sort editors by propertyOrder
    this.property_order = Object.keys(this.editors);
    this.property_order = this.property_order.sort(function(a,b) {
      var ordera = self.editors[a].schema.propertyOrder;
      var orderb = self.editors[b].schema.propertyOrder;
      if(typeof ordera !== "number") ordera = 1000;
      if(typeof orderb !== "number") orderb = 1000;

      return ordera - orderb;
    });
  },
  build: function() {
    var self = this;

    this.container.className += ' not-translating';

    // If the object should be rendered as a table row
    if(this.options.table_row) {
      this.editor_holder = this.container;
      $each(this.editors, function(key,editor) {
        var holder = self.theme.getTableCell();
        self.editor_holder.appendChild(holder);

        editor.setContainer(holder);
        editor.build();
        editor.postBuild();

        if(self.editors[key].options.hidden) {
          holder.style.display = 'none';
        }

        if (self.editors[key].options.grid_columns && !self.editors[key].options.input_width) {
          holder.style.flex = self.editors[key].options.grid_columns;
        }

        if(self.editors[key].options.input_width) {
          holder.style.width = self.editors[key].options.input_width;
          holder.firstChild && (holder.firstChild.style.width = self.editors[key].options.input_width);
        }
      });
    }
    // If the object should be rendered as a table
    else if(this.options.table) {
      // TODO: table display format
      throw "Not supported yet";
    }
    // If the object should be rendered as a div
    else {
      this.header = document.createElement('span');
      this.header.textContent = this.getTitle();
      this.title = this.theme.getHeader(this.header);
      this.container.appendChild(this.title);
      this.container.style.position = 'relative';

      // Edit JSON modal
      this.editjson_holder = document.createElement('div');
      this.editjson_holder.className = 'edit-json-holder';
      this.editjson_textarea = this.theme.getTextareaInput();
      this.editjson_actions = document.createElement('div');
      this.editjson_actions.className = 'edit-json-actions';
      this.editjson_save = this.getButton('Save','save','Save');
      this.editjson_save.className += ' round-btn inverted';
      this.editjson_save.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.saveJSON();
      });
      this.editjson_cancel = this.getButton('Cancel','cancel','Cancel');
      this.editjson_cancel.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.hideEditJSON();
      });
      this.editjson_cancel.className += ' round-btn inverted';
      this.editjson_holder.appendChild(this.editjson_textarea);
      this.editjson_holder.appendChild(this.editjson_actions);
      this.editjson_actions.appendChild(this.editjson_cancel);
      this.editjson_actions.appendChild(this.editjson_save);

      // Manage Properties modal
      this.addproperty_holder = this.theme.getModal();
      this.addproperty_list = document.createElement('div');
      this.addproperty_list.style.width = '295px';
      this.addproperty_list.style.maxHeight = '160px';
      this.addproperty_list.style.padding = '5px 0';
      this.addproperty_list.style.overflowY = 'auto';
      this.addproperty_list.style.overflowX = 'hidden';
      this.addproperty_list.style.paddingLeft = '5px';
      this.addproperty_list.setAttribute('class', 'property-selector');
      this.addproperty_add = this.getButton('add','add','add');
      this.addproperty_input = this.theme.getFormInputField('text');
      this.addproperty_input.setAttribute('placeholder','Property name...');
      this.addproperty_input.style.width = '220px';
      this.addproperty_input.style.marginBottom = '0';
      this.addproperty_input.style.display = 'inline-block';
      this.addproperty_add.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(self.addproperty_input.value) {
          if(self.editors[self.addproperty_input.value]) {
            window.alert('there is already a property with that name');
            return;
          }

          self.addObjectProperty(self.addproperty_input.value);
          if(self.editors[self.addproperty_input.value]) {
            self.editors[self.addproperty_input.value].disable();
          }
          self.onChange(true);
        }
      });
      this.addproperty_holder.appendChild(this.addproperty_list);
      this.addproperty_holder.appendChild(this.addproperty_input);
      this.addproperty_holder.appendChild(this.addproperty_add);
      var spacer = document.createElement('div');
      spacer.style.clear = 'both';
      this.addproperty_holder.appendChild(spacer);


      // Description
      this.description = this.theme.getDescription(this.schema.description || '');
      this.container.appendChild(this.description);

      // Translation
      this.translation_holder = this.theme.getTranslationHolder();
      if (this.schema.languages) {
        this.translation_holder.firstChild.lastChild.textContent = this.schema.languages.list[this.schema.languages.original];
        this.translate_to = null;
        for (const key in this.schema.languages.list)
          if (this.schema.languages.list.hasOwnProperty(key) && key !== this.schema.languages.original) {
            const lang_code = key;
            const lang_str = this.schema.languages.list[key];
            if (!this.translate_to) {
              this.translate_to = lang_code;
              this.setRTLTranslation();
              this.translation_holder.lastChild.children[2].textContent = lang_str;
            }
            const translateItem = this.theme.getTranslationItem(lang_str);
            translateItem.addEventListener('click', () => {
              this.jsoneditor.options.translations = this.getTranslations();
              this.translate_to = lang_code;
              this.setRTLTranslation();
              this.setCurrentTranslation(this.jsoneditor.options.translations[this.translate_to] || {});
              this.translation_holder.lastChild.children[2].textContent = lang_str;
            });
            this.translation_holder.lastChild.lastChild.appendChild(translateItem);
          }
      }
      this.container.appendChild(this.translation_holder);

      // Validation error placeholder area
      this.error_holder = document.createElement('div');
      this.description.appendChild(this.error_holder);

      // Container for child editor area
      this.editor_holder = this.theme.getIndentedPanel();
      this.container.appendChild(this.editor_holder);

      // Container for rows of child editors
      this.row_container = this.theme.getGridContainer();
      this.editor_holder.appendChild(this.row_container);
      this.editor_holder.appendChild(this.editjson_holder);

      $each(this.editors, function(key,editor) {
        var holder = self.theme.getGridColumn();
        self.row_container.appendChild(holder);

        editor.setContainer(holder);
        editor.build();
        editor.postBuild();

        if (key in self.translate_editors) {
          var translate_holder = self.theme.getGridColumn();
          self.row_container.appendChild(translate_holder);

          self.translate_editors[key].setContainer(translate_holder);
          self.translate_editors[key].build();
          self.translate_editors[key].postBuild();
        }
      });

      // Control buttons
      this.title_controls = this.theme.getHeaderButtonHolder();
      this.editjson_controls = this.theme.getHeaderButtonHolder();
      this.translate_controls = this.theme.getHeaderButtonHolder();
      this.translate_controls.className += ' translate-controls';
      this.addproperty_controls = this.theme.getHeaderButtonHolder();
      this.title.appendChild(this.title_controls);
      this.title.appendChild(this.editjson_controls);
      this.title.appendChild(this.addproperty_controls);
      this.description.appendChild(this.translate_controls);

      // Show/Hide button
      this.collapsed = false;
      this.toggle_button = this.getButton('','collapse',this.translate('button_collapse'));
      this.title_controls.appendChild(this.toggle_button);
      this.toggle_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(self.collapsed) {
          self.editor_holder.style.maxHeight = self.editor_holder.scrollHeight + 'px';
          setTimeout(() => { self.editor_holder.style.maxHeight = null; self.editor_holder.style.overflow = null }, 200);
          self.collapsed = false;
          self.setButtonText(self.toggle_button,'','collapse',self.translate('button_collapse'));
        }
        else {
          self.editor_holder.style.maxHeight = self.editor_holder.scrollHeight + 'px';
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              self.editor_holder.style.overflow = 'hidden'; self.editor_holder.style.maxHeight = '0';
            });
          });
          self.collapsed = true;
          self.setButtonText(self.toggle_button,'','expand',self.translate('button_expand'));
        }
      });
      this.title.addEventListener('click', () => {
        if (this.parent) this.toggle_button.click();
      });
      this.description.addEventListener('click', () => {
        if (this.parent) this.toggle_button.click();
      });

      // Check if has advanced parent
      this.is_advanced_descendant = false;
      var check_node = this;
      while (check_node) {
        this.is_advanced_descendant = this.is_advanced_descendant || (check_node.parent && check_node.parent.isAdvanced && check_node.parent.isAdvanced(check_node))
        check_node = check_node.parent;
      }

      // If it should start collapsed
      if(this.options.collapsed || this.is_advanced_descendant) {
        $trigger(this.toggle_button,'click');
      }

      // Collapse button disabled
      if(this.schema.options && typeof this.schema.options.disable_collapse !== "undefined") {
        if(this.schema.options.disable_collapse) this.toggle_button.style.display = 'none';
      }
      else if(this.jsoneditor.options.disable_collapse) {
        this.toggle_button.style.display = 'none';
      }

      // Edit JSON Button
      this.editjson_button = this.theme.getBoolean(['EDITOR', 'JSON']);
      this.editjson_button.className += ' edit-json';
      this.editjson_button.firstChild.className += ' active';
      this.editjson_button.firstChild.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.saveJSON();
      });
      this.editjson_button.lastChild.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.showEditJSON();
      });
      this.editjson_controls.appendChild(this.editjson_button);

      // Edit JSON Buttton disabled
      if(this.schema.options && typeof this.schema.options.disable_edit_json !== "undefined") {
        if(this.schema.options.disable_edit_json) this.editjson_button.style.display = 'none';
      }
      else if(this.jsoneditor.options.disable_edit_json) {
        this.editjson_button.style.display = 'none';
      }

      // Translate Button
      this.translate_button = this.getButton('Translate');
      this.translate_button.className += ' round-btn';
      this.translate_button.insertBefore(this.theme.getIcon('transfer'), this.translate_button.firstChild);
      this.translate_mode = false;
      this.translate_button.addEventListener('click', () => {
        var new_mode = !this.translate_mode;
        this.translation_holder.style.display = new_mode ? 'block' : null;
        this.container.className = this.container.className.replace(/\s*not-translating/g, '');
        this.container.className = this.container.className.replace(/\s*translating/g, '');
        if (new_mode) this.container.className += ' translating';
        else this.container.className += ' not-translating';
        if (new_mode) {
          this.setCurrentTranslation((this.jsoneditor.options.translations || {})[this.translate_to] || {});
          this.enableTranslation();
        } else this.disableTranslation();
        this.translate_button.lastChild.innerHTML = (new_mode ? 'Exit Translation' : 'Translate');
        this.translate_button.className = this.translate_button.className.replace(/\s*inverted/g, '');
        if (new_mode) this.translate_button.className += ' inverted';
        this.translate_mode = new_mode;
      });

      if ('languages' in this.schema) {
        this.translate_controls.appendChild(this.translate_button);
      }

      // Object Properties Button
      this.addproperty_button = this.getButton('Properties','edit','Object Properties');
      this.addproperty_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggleAddProperty();
      });
      this.addproperty_controls.appendChild(this.addproperty_button);
      this.addproperty_controls.appendChild(this.addproperty_holder);
      this.refreshAddProperties();
    }

    // Fix table cell ordering
    if(this.options.table_row) {
      this.editor_holder = this.container;
      $each(this.property_order,function(i,key) {
        self.editor_holder.appendChild(self.editors[key].container);
      });
    }
    // Layout object editors in grid if needed
    else {
      // Initial layout
      this.layoutEditors(true);
      // Do it again now that we know the approximate heights of elements
      this.layoutEditors();
    }
  },
  showEditJSON: function() {
    if(!this.editjson_holder) return;
    if(this.editing_json) return;
    this.hideAddProperty();

    this.editjson_button.firstChild.className = this.editjson_button.firstChild.className.replace(/\s*active/g, '');
    this.editjson_button.lastChild.className += ' active';

    this.row_container.style.display = 'none';

    // Start the textarea with the current value
    if (this.translate_mode) {
      this.editjson_textarea.value = JSON.stringify(this.getCurrentTranslation(),null,2);
    } else {
      this.editjson_textarea.value = JSON.stringify(this.getValue(),null,2);
    }

    // Disable the rest of the form while editing JSON
    this.disable();

    this.editjson_holder.style.display = 'block';
    this.editjson_button.disabled = false;
    this.editing_json = true;
  },
  hideEditJSON: function() {
    if(!this.editjson_holder) return;
    if(!this.editing_json) return;

    this.editjson_button.lastChild.className = this.editjson_button.firstChild.className.replace(/\s*active/g, '');
    this.editjson_button.firstChild.className += ' active';

    this.row_container.style.display = '';
    this.editjson_holder.style.display = '';

    this.enable();
    this.editing_json = false;
  },
  saveJSON: function() {
    if(!this.editjson_holder) return;

    try {
      var json = JSON.parse(this.editjson_textarea.value);
      if (this.translate_mode) this.setCurrentTranslation(json);
      else this.setValue(json);
      this.hideEditJSON();
    }
    catch(e) {
      window.alert('invalid JSON');
      throw e;
    }
  },
  insertPropertyControlUsingPropertyOrder: function (property, control, container) {
    var propertyOrder;
    if (this.schema.properties[property])
      propertyOrder = this.schema.properties[property].propertyOrder;
    if (typeof propertyOrder !== "number") propertyOrder = 1000;
    control.propertyOrder = propertyOrder;

    for (var i = 0; i < container.childNodes.length; i++) {
      var child = container.childNodes[i];
      if (control.propertyOrder < child.propertyOrder) {
        this.addproperty_list.insertBefore(control, child);
        control = null;
        break;
      }
    }
    if (control) {
      this.addproperty_list.appendChild(control);
    }
  },
  addPropertyCheckbox: function(key) {
    var self = this;
    var checkbox, label, labelText, control;

    checkbox = self.theme.getCheckbox();
    checkbox.style.width = 'auto';

    if (this.schema.properties[key] && this.schema.properties[key].title)
      labelText = this.schema.properties[key].title;
    else
      labelText = key;

    label = self.theme.getCheckboxLabel(labelText);

    control = self.theme.getFormControl(label,checkbox);
    control.style.paddingBottom = control.style.marginBottom = control.style.paddingTop = control.style.marginTop = 0;
    control.style.height = 'auto';
    //control.style.overflowY = 'hidden';

    this.insertPropertyControlUsingPropertyOrder(key, control, this.addproperty_list);

    checkbox.checked = key in this.editors;
    checkbox.addEventListener('change',function() {
      if(checkbox.checked) {
        self.addObjectProperty(key);
      }
      else {
        self.removeObjectProperty(key);
      }
      self.onChange(true);
    });
    self.addproperty_checkboxes[key] = checkbox;

    return checkbox;
  },
  showAddProperty: function() {
    if(!this.addproperty_holder) return;
    this.hideEditJSON();

    // Position the form directly beneath the button
    // TODO: edge detection
    this.addproperty_holder.style.left = this.addproperty_button.offsetLeft+"px";
    this.addproperty_holder.style.top = this.addproperty_button.offsetTop + this.addproperty_button.offsetHeight+"px";

    // Disable the rest of the form while editing JSON
    this.disable();

    this.adding_property = true;
    this.addproperty_button.disabled = false;
    this.addproperty_holder.style.display = '';
    this.refreshAddProperties();
  },
  hideAddProperty: function() {
    if(!this.addproperty_holder) return;
    if(!this.adding_property) return;

    this.addproperty_holder.style.display = 'none';
    this.enable();

    this.adding_property = false;
  },
  toggleAddProperty: function() {
    if(this.adding_property) this.hideAddProperty();
    else this.showAddProperty();
  },
  removeObjectProperty: function(property) {
    if(this.editors[property]) {
      this.editors[property].unregister();
      delete this.editors[property];

      this.refreshValue();
      this.layoutEditors();
    }
  },
  addObjectProperty: function(name, prebuild_only) {
    var self = this;

    // Property is already added
    if(this.editors[name]) return;

    // Property was added before and is cached
    if(this.cached_editors[name]) {
      this.editors[name] = this.cached_editors[name];
      if(prebuild_only) return;
      this.editors[name].register();
    }
    // New property
    else {
      if(!this.canHaveAdditionalProperties() && (!this.schema.properties || !this.schema.properties[name])) {
        return;
      }

      var schema = self.getPropertySchema(name);


      // Add the property
      var editor = self.jsoneditor.getEditorClass(schema);

      self.editors[name] = self.jsoneditor.createEditor(editor,{
        jsoneditor: self.jsoneditor,
        schema: schema,
        path: self.path+'.'+name,
        parent: self
      });
      self.editors[name].preBuild();

      if(!prebuild_only) {
        var holder = self.theme.getChildEditorHolder();
        self.editor_holder.appendChild(holder);
        self.editors[name].setContainer(holder);
        self.editors[name].build();
        self.editors[name].postBuild();
      }

      self.cached_editors[name] = self.editors[name];
    }

    // If we're only prebuilding the editors, don't refresh values
    if(!prebuild_only) {
      self.refreshValue();
      self.layoutEditors();
    }
  },
  onChildEditorChange: function(editor) {
    this.refreshValue();
    this._super(editor);
  },
  canHaveAdditionalProperties: function() {
    if (typeof this.schema.additionalProperties === "boolean") {
      return this.schema.additionalProperties;
    }
    return !this.jsoneditor.options.no_additional_properties;
  },
  destroy: function() {
    $each(this.cached_editors, function(i,el) {
      el.destroy();
    });
    if(this.editor_holder) this.editor_holder.innerHTML = '';
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.error_holder && this.error_holder.parentNode) this.error_holder.parentNode.removeChild(this.error_holder);

    this.editors = null;
    this.cached_editors = null;
    if(this.editor_holder && this.editor_holder.parentNode) this.editor_holder.parentNode.removeChild(this.editor_holder);
    this.editor_holder = null;

    this._super();
  },
  getValue: function() {
    var result = this._super();
    this.filterJSON(result);
    return result;
  },
  refreshValue: function() {
    this.value = {};
    var self = this;

    for(var i in this.editors) {
      if(!this.editors.hasOwnProperty(i)) continue;
      this.value[i] = this.editors[i].getValue();
    }
    
    if(this.adding_property) this.refreshAddProperties();
  },
  refreshAddProperties: function() {
    if(this.options.disable_properties || (this.options.disable_properties !== false && this.jsoneditor.options.disable_properties)) {
      this.addproperty_controls.style.display = 'none';
      return;
    }

    var can_add = false, can_remove = false, num_props = 0, i, show_modal = false;

    // Get number of editors
    for(i in this.editors) {
      if(!this.editors.hasOwnProperty(i)) continue;
      num_props++;
    }

    // Determine if we can add back removed properties
    can_add = this.canHaveAdditionalProperties() && !(typeof this.schema.maxProperties !== "undefined" && num_props >= this.schema.maxProperties);

    if(this.addproperty_checkboxes) {
      this.addproperty_list.innerHTML = '';
    }
    this.addproperty_checkboxes = {};

    // Check for which editors can't be removed or added back
    for(i in this.cached_editors) {
      if(!this.cached_editors.hasOwnProperty(i)) continue;

      this.addPropertyCheckbox(i);

      if(this.isRequired(this.cached_editors[i]) && i in this.editors) {
        this.addproperty_checkboxes[i].disabled = true;
      }

      if(typeof this.schema.minProperties !== "undefined" && num_props <= this.schema.minProperties) {
        this.addproperty_checkboxes[i].disabled = this.addproperty_checkboxes[i].checked;
        if(!this.addproperty_checkboxes[i].checked) show_modal = true;
      }
      else if(!(i in this.editors)) {
        if(!can_add  && !this.schema.properties.hasOwnProperty(i)) {
          this.addproperty_checkboxes[i].disabled = true;
        }
        else {
          this.addproperty_checkboxes[i].disabled = false;
          show_modal = true;
        }
      }
      else {
        show_modal = true;
        can_remove = true;
      }
    }

    if(this.canHaveAdditionalProperties()) {
      show_modal = true;
    }

    // Additional addproperty checkboxes not tied to a current editor
    for(i in this.schema.properties) {
      if(!this.schema.properties.hasOwnProperty(i)) continue;
      if(this.cached_editors[i]) continue;
      show_modal = true;
      this.addPropertyCheckbox(i);
    }

    // If no editors can be added or removed, hide the modal button
    if(!show_modal) {
      this.hideAddProperty();
      this.addproperty_controls.style.display = 'none';
    }
    // If additional properties are disabled
    else if(!this.canHaveAdditionalProperties()) {
      this.addproperty_add.style.display = 'none';
      this.addproperty_input.style.display = 'none';
    }
    // If no new properties can be added
    else if(!can_add) {
      this.addproperty_add.disabled = true;
    }
    // If new properties can be added
    else {
      this.addproperty_add.disabled = false;
    }
  },
  isRequired: function(editor) {
    if(typeof editor.schema.required === "boolean") return editor.schema.required;
    else if(Array.isArray(this.schema.required)) return this.schema.required.indexOf(editor.key) > -1;
    else if(this.jsoneditor.options.required_by_default) return true;
    else return false;
  },
  isAdvanced: function(editor) {
    if(Array.isArray(this.schema.advanced)) return this.schema.advanced.indexOf(editor.key) > -1;
    else return false;
  },
  setValue: function(value, initial) {
    var self = this;
    value = value || {};

    if(typeof value !== "object" || Array.isArray(value)) value = {};

    // First, set the values for all of the defined properties
    $each(this.cached_editors, function(i,editor) {
      // Value explicitly set
      if(typeof value[i] !== "undefined") {
        self.addObjectProperty(i);
        editor.setValue(value[i],initial);
      }
      // Otherwise, remove value unless this is the initial set or it's required
      else if(!initial && !self.isRequired(editor)) {
        // self.removeObjectProperty(i);
      }
      // Otherwise, set the value to the default
      else {
        editor.setValue(editor.getDefault(),initial);
      }
    });

    $each(value, function(i,val) {
      if(!self.cached_editors[i]) {
        self.addObjectProperty(i);
        if(self.editors[i]) self.editors[i].setValue(val,initial);
      }
    });

    this.refreshValue();
    this.layoutEditors();
    this.onChange();
  },
  showValidationErrors: function(errors) {
    var self = this;

    // Get all the errors that pertain to this editor
    var my_errors = [];
    var other_errors = [];
    $each(errors, function(i,error) {
      if(error.path === self.path) {
        my_errors.push(error);
      }
      else {
        other_errors.push(error);
      }
    });

    // Show errors for this editor
    if(this.error_holder) {
      if(my_errors.length) {
        var message = [];
        this.error_holder.innerHTML = '';
        this.error_holder.style.display = '';
        $each(my_errors, function(i,error) {
          self.error_holder.appendChild(self.theme.getErrorMessage(error.message));
        });
      }
      // Hide error area
      else {
        this.error_holder.style.display = 'none';
      }
    }

    // Show error for the table row if this is inside a table
    if(this.options.table_row) {
      if(my_errors.length) {
        this.theme.addTableRowError(this.container);
      }
      else {
        this.theme.removeTableRowError(this.container);
      }
    }

    // Show errors for child editors
    $each(this.editors, function(i,editor) {
      editor.showValidationErrors(other_errors);
    });
  },
  isEmptyField: function(value, field) {
    const editor = this.editors && this.editors[field];
    const defaultVal = editor && this.editors[field].getDefault();
    const logicalDrop = editor && editor.shouldIncludeObject && !editor.shouldIncludeObject(value);
    return !value || (value && value.constructor === Array && value.length === 0) || value === defaultVal
      || (value && value.constructor === Object && Object.keys(value).length === 0) || logicalDrop;
  },
  filterJSON: function(result) {
    const shouldOmit = (key) => !this.isRequired(this.editors[key]);
    if (this.jsoneditor.options.remove_empty_properties || this.options.remove_empty_properties) {
      var shouldInclude = this.shouldIncludeObject(result);
      for (var i in result) {
        if (result.hasOwnProperty(i) && shouldOmit(i)) {
          if (this.isEmptyField(result[i], i)) delete result[i];
        }
      }
    }
  },
  shouldIncludeObject: function(value) {
    if (!this.parent) return true; // Root object should be included

    var included = true;
    var cur = this;
    while (cur.parent) {
      if (!cur.parent.isRequired(cur)) included = false;
      cur = cur.parent;
    }

    if (included) return true; // Include if all parents are required
    else {
      for (var i in value) {
        if (value.hasOwnProperty(i)) {
          if (!this.isEmptyField(value[i], i)) {
            return true; // Include if there's a field set
          }
        }
      }
      return false;
    }
  }
});
