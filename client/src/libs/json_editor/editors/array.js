import Sortable from 'sortablejs';
import { $extend, $each, $isplainobject, $trigger, $triggerc } from '../utils';

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.type == 'array' && schema.format == 'table') {
    return 'array';
  }
});

JSONEditor.defaults.editors.array = JSONEditor.defaults.editors.array.extend({
  getDefault: function() {
    return this.schema["default"] || [];
  },
  register: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].register();
      }
    }
  },
  unregister: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].unregister();
      }
    }
  },
  getNumColumns: function() {
    var info = this.getItemInfo(0);
    // Tabs require extra horizontal space
    if(this.tabs_holder) {
      return Math.max(Math.min(12,info.width+2),4);
    }
    else {
      return info.width;
    }
  },
  enable: function() {
    if(this.add_row_button) this.add_row_button.disabled = false;
    if(this.remove_all_rows_button) this.remove_all_rows_button.disabled = false;
    if(this.delete_last_row_button) this.delete_last_row_button.disabled = false;
    
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].enable();
        
        if(this.rows[i].move_button) this.rows[i].move_button.disabled = false;
        if(this.rows[i].delete_button) this.rows[i].delete_button.disabled = false;
      }
    }
    this._super();
  },
  disable: function() {
    if(this.add_row_button) this.add_row_button.disabled = true;
    if(this.remove_all_rows_button) this.remove_all_rows_button.disabled = true;
    if(this.delete_last_row_button) this.delete_last_row_button.disabled = true;

    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].disable();

        if(this.rows[i].move_button) this.rows[i].move_button.disabled = true;
        if(this.rows[i].delete_button) this.rows[i].delete_button.disabled = true;
      }
    }
    this._super();
  },
  preBuild: function() {
    this._super();
    
    this.rows = [];
    this.row_cache = [];

    this.hide_delete_buttons = this.options.disable_array_delete || this.jsoneditor.options.disable_array_delete;
    this.hide_delete_all_rows_buttons = this.hide_delete_buttons || this.options.disable_array_delete_all_rows || this.jsoneditor.options.disable_array_delete_all_rows;
    this.hide_delete_last_row_buttons = this.hide_delete_buttons || this.options.disable_array_delete_last_row || this.jsoneditor.options.disable_array_delete_last_row;
    this.hide_move_buttons = this.options.disable_array_reorder || this.jsoneditor.options.disable_array_reorder;
    this.hide_add_button = this.options.disable_array_add || this.jsoneditor.options.disable_array_add;
  },
  isMultipleArray: function() {
    if (this.multiple !== undefined) return this.multiple;
    var schema = this.getItemSchema(0);
    schema = this.jsoneditor.expandRefs(schema);
    this.multiple = (typeof schema.type !== 'string') || (schema.type === 'any') || schema.oneOf || schema.anyOf;
    return this.multiple;
  },
  isCompressedArray: function() {
    if (this.compressed !== undefined) return this.compressed;
    var schema = this.getItemSchema(0);
    schema = this.jsoneditor.expandRefs(schema);
    this.compressed = (schema.type !== 'object' || this.isObjectTable()) && !this.isMultipleArray();
    return this.compressed;
  },
  isWideArray: function() {
    if (this.wide !== undefined) return this.wide;
    var schema = this.getItemSchema(0);
    schema = this.jsoneditor.expandRefs(schema);
    this.wide =
      (schema.type === 'string' && schema.format === 'html') ||
      schema.type === 'multitext' ||
      this.isFileArray() || this.isObjectTable();
    return this.wide;
  },
  isFileArray: function() {
    if (this.file_array !== undefined) return this.file_array;
    var schema = this.getItemSchema(0);
    schema = this.jsoneditor.expandRefs(schema);
    this.file_array = schema.type === 'string' && schema.format === 'url';
    return this.file_array;
  },
  isObjectTable: function() {
    if (this.object_table !== undefined) return this.object_table;
    var schema = this.getItemSchema(0);
    schema = this.jsoneditor.expandRefs(schema);
    this.object_table = schema.type === 'object' && schema.options && (schema.options.table_row || schema.options.layout === 'grid');
    return this.object_table;
  },
  build: function() {
    var self = this;

    if(!this.options.compact) {
      if (this.isCompressedArray()) {
        this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        if(this.schema.description) {
          this.description = this.theme.getFormInputDescription(this.schema.description);
        }
        this.error_holder = document.createElement('div');

        this.panel = document.createElement('div');
        this.row_holder = document.createElement('div');
        this.row_holder.className = 'array-row-holder';
        this.controls = this.theme.getButtonHolder();
        this.readonly_view = document.createElement('div');
        this.readonly_view.className = 'array readonly-view';
        this.panel.appendChild(this.readonly_view);
        this.panel.appendChild(this.row_holder);
        this.panel.appendChild(this.controls);
        this.panel.appendChild(this.error_holder);
        this.container.appendChild(this.theme.getFormControl(this.label, this.panel, this.description))
        if (this.isWideArray()) {
          this.container.lastChild.className += ' wide-array';
        }
      } else {
        this.header = document.createElement('span');
        this.header.textContent = this.getTitle();
        this.title = this.theme.getHeader(this.header);
        this.container.appendChild(this.title);
        this.title_controls = this.theme.getHeaderButtonHolder();
        this.title.appendChild(this.title_controls);
        this.description = this.theme.getDescription(this.schema.description || '');
        this.container.appendChild(this.description);
        this.error_holder = document.createElement('div');
        this.description.appendChild(this.error_holder);
        this.panel = this.theme.getIndentedPanel();
        this.container.appendChild(this.panel);
        this.row_holder = document.createElement('div');
        this.panel.appendChild(this.row_holder);
        this.controls = document.createElement('span');
        this.controls.className = 'array-buttons';
        this.control_bar = document.createElement('div');
        this.control_bar.appendChild(this.controls);
        this.control_bar.className = 'array-control-bar';
        this.panel.appendChild(this.control_bar)
        this.container.lastChild.className += ' object-array';
      }
      this.sorter = new Sortable(this.row_holder, {
        handle: '.array-move-item',
        animation: 200,
        onChange: function (e) {
          if (e.newIndex === 0) {
            self.row_holder.replaceChild(self.row_holder.children[1], self.row_holder.children[1]);
          }
        },
        onUpdate: function (e) {
          var rows = self.getValue();
          var old = rows[e.oldIndex];
          var oldRow = self.rows[e.oldIndex];
          if (e.oldIndex < e.newIndex) {
            for (var i = e.oldIndex; i < e.newIndex; i++) {
              rows[i] = rows[i + 1];
              self.rows[i] = self.rows[i + 1];
              self.rows[i].delete_button.setAttribute('data-i', i);
            }
          } else {
            for (var i = e.oldIndex; i > e.newIndex; i--) {
              rows[i] = rows[i - 1];
              self.rows[i] = self.rows[i - 1];
              self.rows[i].delete_button.setAttribute('data-i', i);
            }
          }
          rows[e.newIndex] = old;
          self.rows[e.newIndex] = oldRow;
          self.rows[e.newIndex].delete_button.setAttribute('data-i', e.newIndex);

          self.setValue(rows);
          self.active_tab = self.rows[e.newIndex].tab;
          self.refreshTabs();

          self.onChange(true);
        },
      });
    }
    else {
      this.panel = this.theme.getIndentedPanel();
      this.container.appendChild(this.panel);
      this.controls = this.theme.getButtonHolder();
      this.panel.appendChild(this.controls);
      this.row_holder = document.createElement('div');
      this.panel.appendChild(this.row_holder);
    }

    // Add controls
    this.addControls();
  },
  updateReadOnlyView: function() {
    if (!this.readonly_view) return
    if (this.rows.length === 0) {
			this.readonly_view.textContent = '[None]';
			this.readonly_view.style.display = null;
    } else {
			this.readonly_view.textContent = '';
			this.readonly_view.style.display = 'none';
		}
  },
  onChildEditorChange: function(editor) {
    this.refreshValue();
    this.refreshTabs(true);
    this._super(editor);
  },
  getItemTitle: function() {
    if(!this.item_title) {
      if(this.schema.items && !Array.isArray(this.schema.items)) {
        var tmp = this.jsoneditor.expandRefs(this.schema.items);
        this.item_title = tmp.title || 'item';
      }
      else {
        this.item_title = 'item';
      }
    }
    return this.item_title;
  },
  getItemSchema: function(i) {
    if(Array.isArray(this.schema.items)) {
      if(i >= this.schema.items.length) {
        if(this.schema.additionalItems===true) {
          return {};
        }
        else if(this.schema.additionalItems) {
          return $extend({},this.schema.additionalItems);
        }
      }
      else {
        return $extend({},this.schema.items[i]);
      }
    }
    else if(this.schema.items) {
      return $extend({},this.schema.items);
    }
    else {
      return {};
    }
  },
  getItemInfo: function(i) {
    var schema = this.getItemSchema(i);
    
    // Check if it's cached
    this.item_info = this.item_info || {};
    var stringified = JSON.stringify(schema);
    if(typeof this.item_info[stringified] !== "undefined") return this.item_info[stringified];
    
    // Get the schema for this item
    schema = this.jsoneditor.expandRefs(schema);
      
    this.item_info[stringified] = {
      title: schema.title || "item",
      'default': schema["default"],
      width: 12,
      child_editors: schema.properties || schema.items
    };
    
    return this.item_info[stringified];
  },
  getElementEditor: function(i) {
    var item_info = this.getItemInfo(i);
    var schema = this.getItemSchema(i);
    schema = this.jsoneditor.expandRefs(schema);
    schema.title = item_info.title+' '+(i+1);
    var editor = this.jsoneditor.getEditorClass(schema);

    var holder;
    if(this.tabs_holder) {
      holder = this.theme.getTabContent();
    }
    else if(item_info.child_editors) {
      holder = this.theme.getChildEditorHolder();
    }
    else if(this.isCompressedArray()){
      holder = document.createElement('div');
    } else {
      holder = this.theme.getIndentedPanel();
    }

    var row_container = document.createElement('div');
    row_container.className = 'array-row-container';
    this.row_holder.appendChild(row_container);

    if (this.isWideArray()) {
      row_container.className += ' array-wide-item';
    }
    if (this.isMultipleArray()) {
      row_container.className += ' array-multiple-item';
    }
    if (this.isObjectTable()) {
      row_container.className += ' array-object-table';
    }

    if (this.isCompressedArray()) {
      var before_controls = document.createElement('div');
      before_controls.className = 'before-item-controls';
    } else {
      var before_controls = document.createElement('span');
      before_controls.className = 'before-object-array-controls';
    }

    row_container.appendChild(before_controls);

    var index = document.createElement('div');
    index.className = 'array-index';
    index.textContent = (i + 1);
    row_container.appendChild(index);
    if (i % 2 === 1) row_container.className += ' even-row';

    holder.className = 'array-item-holder';
    row_container.appendChild(holder);

    var ret = this.jsoneditor.createEditor(editor,{
      jsoneditor: this.jsoneditor,
      schema: schema,
      container: holder,
      path: this.path+'.'+i,
      parent: this,
      required: true
    });
    ret.preBuild();
    ret.build();
    ret.postBuild();
    ret.before_controls = before_controls;

    if (this.isCompressedArray()) {
      ret.array_controls = document.createElement('div');
      ret.array_controls.className = 'array-controls';
      row_container.appendChild(ret.array_controls);
    } else {
      ret.array_controls = document.createElement('span');
      ret.array_controls.className = 'object-array-controls';
      if (ret.title_controls) ret.title_controls.insertBefore(ret.array_controls, ret.title_controls.firstChild);
      else {
        ret.array_controls.className += ' floating';
        ret.container.insertBefore(ret.array_controls, ret.container.firstChild);
      }
      holder.className += ' array-wide-item';
    }

    return ret;
  },
  destroy: function() {
    this.empty(true);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.row_holder && this.row_holder.parentNode) this.row_holder.parentNode.removeChild(this.row_holder);
    if(this.controls && this.controls.parentNode) this.controls.parentNode.removeChild(this.controls);
    if(this.panel && this.panel.parentNode) this.panel.parentNode.removeChild(this.panel);
    
    this.rows = this.row_cache = this.title = this.description = this.row_holder = this.panel = this.controls = null;

    this._super();
  },
  empty: function(hard) {
    if(!this.rows) return;
    var self = this;
    $each(this.rows,function(i,row) {
      if(hard) {
        if(row.tab && row.tab.parentNode) row.tab.parentNode.removeChild(row.tab);
        self.destroyRow(row,true);
        self.row_cache[i] = null;
      }
      self.rows[i] = null;
    });
    self.rows = [];
    if(hard) self.row_cache = [];
  },
  destroyRow: function(row,hard) {
    var holder = row.container.parentNode;
    if(hard) {
      row.destroy();
      if(holder.parentNode) holder.parentNode.removeChild(holder);
      if(row.tab && row.tab.parentNode) row.tab.parentNode.removeChild(row.tab);
    }
    else {
      if(row.tab) row.tab.style.display = 'none';
      holder.style.display = 'none';
      row.unregister();
    }
  },
  getMax: function() {
    if((Array.isArray(this.schema.items)) && this.schema.additionalItems === false) {
      return Math.min(this.schema.items.length,this.schema.maxItems || Infinity);
    }
    else {
      return this.schema.maxItems || Infinity;
    }
  },
  refreshTabs: function(refresh_headers) {
    var self = this;
    $each(this.rows, function(i,row) {
      if(!row.tab) return;

      if(refresh_headers) {
        row.tab_text.textContent = row.getHeaderText();
      }
      else {
        if(row.tab === self.active_tab) {
          self.theme.markTabActive(row.tab);
          row.container.style.display = '';
        }
        else {
          self.theme.markTabInactive(row.tab);
          row.container.style.display = 'none';
        }
      }
    });
  },
  setValue: function(value, initial) {
    // Update the array's value, adding/removing rows when necessary
    value = value || [];
    
    if(!(Array.isArray(value))) value = [value];
    
    var serialized = JSON.stringify(value);
    if(serialized === this.serialized) return;

    // Make sure value has between minItems and maxItems items in it
    if(this.schema.minItems) {
      while(value.length < this.schema.minItems) {
        value.push(this.getItemInfo(value.length)["default"]);
      }
    }
    if(this.getMax() && value.length > this.getMax()) {
      value = value.slice(0,this.getMax());
    }

    var self = this;
    $each(value,function(i,val) {
      if(self.rows[i]) {
        // TODO: don't set the row's value if it hasn't changed
        self.rows[i].setValue(val,initial);
      }
      else if(self.row_cache[i]) {
        self.rows[i] = self.row_cache[i];
        self.rows[i].setValue(val,initial);
        self.rows[i].container.parentNode.style.display = '';
        if(self.rows[i].tab) self.rows[i].tab.style.display = '';
        self.rows[i].register();
      }
      else {
        self.addRow(val,initial);
      }
    });

    for(var j=value.length; j<self.rows.length; j++) {
      self.destroyRow(self.rows[j]);
      self.rows[j] = null;
    }
    self.rows = self.rows.slice(0,value.length);

    // Set the active tab
    var new_active_tab = null;
    $each(self.rows, function(i,row) {
      if(row.tab === self.active_tab) {
        new_active_tab = row.tab;
        return false;
      }
    });
    if(!new_active_tab && self.rows.length) new_active_tab = self.rows[0].tab;

    self.active_tab = new_active_tab;

    self.refreshValue(initial);
    self.refreshTabs(true);
    self.refreshTabs();
    self.updateReadOnlyView();

    self.onChange();
    
    // TODO: sortable
  },
  refreshValue: function(force) {
    var self = this;
    var oldi = this.value? this.value.length : 0;
    this.value = [];

    $each(this.rows,function(i,editor) {
      // Get the value for this editor
      self.value[i] = editor.getValue();
    });
    
    if(oldi !== this.value.length || force) {
      // If we currently have minItems items in the array
      var minItems = this.schema.minItems && this.schema.minItems >= this.rows.length;
      
      $each(this.rows,function(i,editor) {
        // Hide the delete button if we have minItems items
        if(editor.delete_button) {
          if(minItems) {
            editor.delete_button.style.display = 'none';
          }
          else {
            editor.delete_button.style.display = '';
          }
        }

        // Get the value for this editor
        self.value[i] = editor.getValue();
      });
      
      var controls_needed = false;
      
      if(!this.value.length) {
        this.delete_last_row_button.style.display = 'none';
        this.remove_all_rows_button.style.display = 'none';
      }
      else if(this.value.length === 1) {      
        this.remove_all_rows_button.style.display = 'none';  

        // If there are minItems items in the array, or configured to hide the delete_last_row button, hide the delete button beneath the rows
        if(minItems || this.hide_delete_last_row_buttons) {
          this.delete_last_row_button.style.display = 'none';
        }
        else {
          this.delete_last_row_button.style.display = '';
          controls_needed = true;
        }
      }
      else {
        if(minItems || this.hide_delete_last_row_buttons) {
          this.delete_last_row_button.style.display = 'none';
        }
        else {
          this.delete_last_row_button.style.display = '';
          controls_needed = true;
        }

        if(minItems || this.hide_delete_all_rows_buttons) {
          this.remove_all_rows_button.style.display = 'none';
        }
        else {
          this.remove_all_rows_button.style.display = '';
          controls_needed = true;
        }
      }

      // If there are maxItems in the array, hide the add button beneath the rows
      if((this.getMax() && this.getMax() <= this.rows.length) || this.hide_add_button){
        this.add_row_button.style.display = 'none';
      }
      else {
        this.add_row_button.style.display = '';
        controls_needed = true;
      }

      if(!this.collapsed && controls_needed) {
        this.controls.style.display = 'inline-block';
      }
      else {
        this.controls.style.display = 'none';
      }
    }
  },
  addRow: function(value, initial) {
    var self = this;
    var i = this.rows.length;

    self.rows[i] = this.getElementEditor(i);
    self.row_cache[i] = self.rows[i];

    if(self.tabs_holder) {
      self.rows[i].tab_text = document.createElement('span');
      self.rows[i].tab_text.textContent = self.rows[i].getHeaderText();
      self.rows[i].tab = self.theme.getTab(self.rows[i].tab_text);
      self.rows[i].tab.addEventListener('click', function(e) {
        self.active_tab = self.rows[i].tab;
        self.refreshTabs();
        e.preventDefault();
        e.stopPropagation();
      });

      self.theme.addTab(self.tabs_holder, self.rows[i].tab);
    }
    
    var controls_holder = self.rows[i].array_controls;
    var before_controls_holder = self.rows[i].before_controls;
    
    // Buttons to delete row, move row up, and move row down
    if(!self.hide_delete_buttons) {
      self.rows[i].delete_button = this.theme.getArrayDeleteButton();
      self.rows[i].delete_button.setAttribute('data-i',i);
      self.rows[i].delete_button.children[0].children[1].children[0].addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.parentNode.style.display = 'none';
        var i = this.parentNode.parentNode.parentNode.getAttribute('data-i')*1;

        var value = self.getValue();

        var newval = [];
        var new_active_tab = null;
        $each(value,function(j,row) {
          if(j===i) {
            // If the one we're deleting is the active tab
            if(self.rows[j].tab === self.active_tab) {
              // Make the next tab active if there is one
              // Note: the next tab is going to be the current tab after deletion
              if(self.rows[j+1]) new_active_tab = self.rows[j].tab;
              // Otherwise, make the previous tab active if there is one
              else if(j) new_active_tab = self.rows[j-1].tab;
            }
            
            return; // If this is the one we're deleting
          }
          newval.push(row);
        });
        self.setValue(newval);
        if(new_active_tab) {
          self.active_tab = new_active_tab;
          self.refreshTabs();
        }

        self.onChange(true);
      });

      if(controls_holder) {
        controls_holder.appendChild(self.rows[i].delete_button);
      }
    }

    if(!self.hide_move_buttons) {
      self.rows[i].move_button = this.theme.getArrayMoveButton();
      if(before_controls_holder) {
        before_controls_holder.appendChild(self.rows[i].move_button);
      }
    }

    if(value) self.rows[i].setValue(value, initial);
    self.refreshTabs();
    self.updateReadOnlyView();
  },
  addControls: function() {
    var self = this;

    var row_holder_display = self.row_holder.style.display;
    var controls_display = self.controls.style.display;

    // Add "new row" and "delete last" buttons below editor
    var addNewRow = () => {
      var i = self.rows.length;
      if(self.row_cache[i]) {
        self.rows[i] = self.row_cache[i];
        self.rows[i].setValue(self.rows[i].getDefault(), true);
        self.rows[i].container.parentNode.style.display = '';
        if(self.rows[i].tab) self.rows[i].tab.style.display = '';
        self.rows[i].register();
      }
      else {
        self.addRow();
      }
      self.active_tab = self.rows[i].tab;
      self.refreshTabs();
      self.refreshValue();
      self.onChange(true);
    }
    if (this.isFileArray()) {
      this.add_row_button = this.theme.getFileUploader();
      this.add_row_button.className += ' file-array-uploader';
      var file_input = this.theme.getFormInputField('file');
      file_input.className = 'file-input';
      this.add_row_button.appendChild(file_input);
      this.add_row_button.children[1].addEventListener('click', () => {
        file_input.click();
      });
      file_input.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(file_input.files && file_input.files.length) {
          addNewRow();
          this.rows[this.rows.length - 1].container.parentNode.style.display = 'none';
          this.rows[this.rows.length - 1].temporary_array_item = true;
          this.rows[this.rows.length - 1].uploadFile(file_input.files[0]);
        }
      });
      this.add_row_button.children[2].addEventListener('click', () => {
        var found;
        for (var i = 0; i < this.rows.length; i++) {
          if (this.rows[i].temporary_array_item && this.rows[i].file_bar.firstChild.innerHTML === 'New File') {
            found = i;
          }
        }
        if (found === undefined) {
          addNewRow();
          found = this.rows.length - 1;
          this.rows[found].temporary_array_item = true;
        }
        this.rows[found].addByEditor();
      });
      this.add_row_button.addEventListener('drop', (e) => {
        addNewRow();
        this.rows[this.rows.length - 1].container.parentNode.style.display = 'none';
        this.rows[this.rows.length - 1].temporary_array_item = true;
        this.rows[this.rows.length - 1].dropFile(e);
      });
    } else {
      var itemName = this.getItemTitle();
      if (itemName === 'item') itemName = '';
      this.add_row_button = this.getButton(itemName, 'add',this.translate('button_add_row_title',[itemName]));

      this.add_row_button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addNewRow();
        if (this.isCompressedArray() && this.isWideArray() && !this.isObjectTable()) {
          this.activateItem(this.rows[this.rows.length - 1]);
          setTimeout(() => this.rows[this.rows.length - 1].afterInputReady(true), 0);
        } else {
          this.rows[this.rows.length - 1].input && this.rows[this.rows.length - 1].input.focus();
        }
      });
    }
    self.controls.appendChild(this.add_row_button);

    this.delete_last_row_button = this.getButton(this.translate('button_delete_last',[this.getItemTitle()]),'delete',this.translate('button_delete_last_title',[this.getItemTitle()]));
    this.delete_last_row_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var rows = self.getValue();
      
      var new_active_tab = null;
      if(self.rows.length > 1 && self.rows[self.rows.length-1].tab === self.active_tab) new_active_tab = self.rows[self.rows.length-2].tab;
      
      rows.pop();
      self.setValue(rows);
      if(new_active_tab) {
        self.active_tab = new_active_tab;
        self.refreshTabs();
      }
      self.onChange(true);
    });
    self.controls.appendChild(this.delete_last_row_button);

    this.remove_all_rows_button = this.getButton(this.translate('button_delete_all'),'delete',this.translate('button_delete_all_title'));
    this.remove_all_rows_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.setValue([]);
      self.onChange(true);
    });
    self.controls.appendChild(this.remove_all_rows_button);

    if (!this.isCompressedArray()) {
      this.collapsed = false;
      this.toggle_button = this.getButton('','collapse',this.translate('button_collapse'));
      this.title_controls.appendChild(this.toggle_button);
      this.toggle_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(self.collapsed) {
          self.collapsed = false;
          self.panel.style.maxHeight = self.panel.scrollHeight + 'px';
          setTimeout(() => { self.panel.style.maxHeight = null; self.panel.style.overflow = null }, 200);
          if(self.tabs_holder) self.tabs_holder.style.display = '';
          self.setButtonText(this,'','collapse',self.translate('button_collapse'));
        }
        else {
          self.collapsed = true;
          self.panel.style.maxHeight = self.panel.scrollHeight + 'px';
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              self.panel.style.overflow = 'hidden'; self.panel.style.maxHeight = '0';
            });
          });
          if(self.tabs_holder) self.tabs_holder.style.display = 'none';
          self.setButtonText(this,'','expand',self.translate('button_expand'));
        }
      });

      // If it should start collapsed
      if(this.options.collapsed) {
        $trigger(this.toggle_button,'click');
      }

      if (!this.isCompressedArray()) {
        this.title.addEventListener('click', () => this.toggle_button.click())
        this.description.addEventListener('click', () => this.toggle_button.click())
      }

      // Collapse button disabled
      if(this.schema.options && typeof this.schema.options.disable_collapse !== "undefined") {
        if(this.schema.options.disable_collapse) this.toggle_button.style.display = 'none';
      }
      else if(this.jsoneditor.options.disable_collapse) {
        this.toggle_button.style.display = 'none';
      }
    }
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

    // Show errors for child editors
    $each(this.rows, function(i,row) {
      row.showValidationErrors(other_errors);
    });
  },
  activateItem: function(item) {
    for (var child = 0; child < this.rows.length; child++) {
      var el = this.rows[child];
      if (el !== item) {
        this.deactivateItem(el);
      }
    }
    item.container.parentNode.className += ' active-item';
  },
  deactivateItem: function(item) {
    item.container.parentNode.className = item.container.parentNode.className.replace(/\s*active-item/g, '');
    item.setEqualHeigths && item.setEqualHeigths();
  },
  getOtherTranslatePair: function(item) {
    var idx = this.rows.indexOf(item);
    var original = this.jsoneditor.original_editors[this.path] && this.jsoneditor.original_editors[this.path].rows[idx];
    var translate = this.jsoneditor.translate_editors[this.path] && this.jsoneditor.translate_editors[this.path].rows[idx];
    return original === item ? translate : original;
  },
  deleteItem: function(item) {
    item.delete_button.children[0].children[1].children[0].click();
  },
  showItem: function(item) {
    item.container.parentNode.style.display = '';
  },
  afterInputReady: function(focus) {
    for (var child = 0; child < this.rows.length; child++) {
      var el = this.rows[child];
      el.afterInputReady && el.afterInputReady(focus);
    }
  },
  enableTranslation: function() {
    for (var child = 0; child < this.rows.length; child++) {
      var el = this.rows[child];
      el.enableTranslation && el.enableTranslation();
    }
  },
  disableTranslation: function() {
    for (var child = 0; child < this.rows.length; child++) {
      var el = this.rows[child];
      el.disableTranslation && el.disableTranslation();
    }
  },
  setCurrentTranslation: function(obj) {
    for (var child = 0; child < this.rows.length; child++) {
      var el = this.rows[child];
      el.setCurrentTranslation && el.setCurrentTranslation(obj[child]);
    }
  },
});
