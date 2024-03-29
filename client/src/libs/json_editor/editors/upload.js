import Mime from 'mime-types'

JSONEditor.defaults.editors.upload = JSONEditor.TaskEditorAbstractEditor.extend({
  getNumColumns: function() {
    return 4;
  },
  build: function() {
    var self = this;
    this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());

    // Input that holds the base64 string
    this.input = this.theme.getFormInputField('hidden');
    this.file_input = this.theme.getFormInputField('file');
    this.file_input.className = 'file-input';
    this.container.appendChild(this.input);
    this.container.appendChild(this.file_input);
    this.file_view = this.theme.getFileView();
    this.file_bar = this.file_view.children[0];
    this.file_preview = this.file_view.children[1];
    this.uploader = this.file_view.children[2];

    this.file_bar.addEventListener('click', this.showPane.bind(this));
    this.file_bar.lastChild.addEventListener('click', this.hidePane.bind(this));
    this.file_preview.children[0].children[1].addEventListener('blur', this.renameFile.bind(this));
    this.file_preview.children[0].children[2].addEventListener('click', () => this.file_input.click());
    this.uploader.children[1].addEventListener('click', () => this.file_input.click());
    this.uploader.children[2].addEventListener('click', this.addByEditor.bind(this));
    this.uploader.addEventListener('drop', this.dropFile.bind(this));
    this.file_input.addEventListener('change', this.changeFile.bind(this));
    this.file_preview.children[2].addEventListener('blur', this.modifyContent.bind(this));

    var description = this.schema.description;
    if (!description) description = '';

    this.preview = this.theme.getFormInputDescription(description);
    this.readonly_view = document.createElement('div');
    this.readonly_view.className = 'file readonly-view';
    this.control = this.theme.getFormControl(this.label, this.file_bar, this.preview);
    this.control.lastChild.appendChild(this.readonly_view);
    this.container.appendChild(this.control);
  },
  addByEditor: function() {
    if (this.parent.activateItem) this.parent.activateItem(this)
    else this.file_view.className += ' active-item';
    this.file_view.className = this.file_view.className.replace(/\s*no-file/g, '');
    this.file_bar.firstChild.innerHTML = 'New File';
    this.file_preview.children[0].children[1].value = ''; // File Rename Field
    this.file_preview.children[1].children[1].innerHTML = this.formatFileSize(0); // File Size
    this.file_preview.children[2].value = ''; // File Editor
    this.pane_shown = true;
    this.file_preview.children[2].style.display = 'block';
    this.new_file = true;
    this.file_preview.children[2].disabled = true;
    this.file_preview.children[3].style.display = 'none';
    this.file_preview.children[0].children[1].focus();
  },
  changeFile: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if(this.file_input.files && this.file_input.files.length) {
      this.file_input.setAttribute('disabled', 'disabled');
      this.uploadFile(this.file_input.files[0]);
    }
  },
  dropFile: function(e) {
    if (this.file_input.getAttribute('disabled')) return;
    var files = e.dataTransfer.files;
    if (files && files.length) {
      this.file_input.setAttribute('disabled', 'disabled');
      this.uploadFile(files[0]);
    }
  },
  uploadFile: function(file) {
    this.setFileError(null);

    if (this.theme.getProgressBar) {
      this.progressBar = this.theme.getProgressBar();
      if (this.parent.activateItem) {
        this.parent.panel.insertBefore(this.progressBar, this.parent.controls);
      } else this.file_view.appendChild(this.progressBar);
    }

    var file_change = this.file_preview.children[0].children[2];

    this.jsoneditor.options.upload(this.path, file, this.getLanguage(), {
      success: (url) => {
        this.setValue(url);

        if (this.progressBar) this.progressBar.parentNode.removeChild(this.progressBar);
        this.file_input.removeAttribute('disabled');
        if (this.temporary_array_item) {
          this.parent.showItem(this);
          this.temporary_array_item = false;
        }
      },
      failure: (error) => {
        this.setFileError(error);
        if (this.progressBar) this.progressBar.parentNode.removeChild(this.progressBar);
        this.file_input.removeAttribute('disabled');
        if (this.temporary_array_item) this.parent.deleteItem(this);
      },
      updateProgress: (progress) => {
        if (this.progressBar) {
          if (progress) this.theme.updateProgressBar(this.progressBar, progress);
          else this.theme.updateProgressBarUnknown(this.progressBar);
        }
      }
    });
  },
  setFileError: function(msg) {
    if (this.file_error && this.parent.activateItem && !this.parent.file_error) this.file_error = null;
    if (this.parent.file_error) this.file_error = this.parent.file_error;
    if(!msg) {
      this.file_error && this.file_error.parentNode.removeChild(this.file_error);
      this.file_error = null;
      this.parent.file_error = null;
      this.setEqualHeigths();
      return;
    }
    if(!this.file_error) {
      this.file_error = document.createElement('div');
      this.file_error.className = 'alert alert-danger file-error';
      var alert_icon = document.createElement('div');
      alert_icon.className = 'alert-icon';
      alert_icon.appendChild(this.theme.getIcon('bell'));
      this.file_error.appendChild(alert_icon);
      var error_content = document.createElement('div');
      error_content.className = 'error-text';
      this.file_error.appendChild(error_content);
      var close_icon = document.createElement('div');
      close_icon.className = 'close-icon';
      close_icon.appendChild(this.theme.getIcon('remove'));
      close_icon.firstChild.addEventListener('click', () => {
        this.setFileError(null);
      })
      this.file_error.appendChild(close_icon);
      if (this.parent.activateItem) { // File Array
        this.parent.panel.insertBefore(this.file_error, this.parent.controls);
        this.parent.file_error = this.file_error;
      } else this.file_view.appendChild(this.file_error);
    }
    this.file_error.children[1].textContent = msg;
    this.setEqualHeigths();
  },
  formatFileSize: function(size) {
    var unit = 'B';
    if (size > 1024 * 1024 * 1024) {
      unit = 'GB';
      size /= 1024 * 1024 * 1024;
    } else if (size > 1024 * 1024) {
      unit = 'MB';
      size /= 1024 * 1024;
    } else if (size > 1024) {
      unit = 'KB';
      size /= 1024;
    }
    var sizeStr = size.toFixed(2);
    while (sizeStr[sizeStr.length - 1] === '0') sizeStr = sizeStr.substr(0, sizeStr.length - 1);
    if (sizeStr[sizeStr.length - 1] === '.') sizeStr = sizeStr.substr(0, sizeStr.length - 1);
    return sizeStr + ' ' + unit;
  },
  isImage: function() {
    var file_name = this.file_bar.firstChild.innerHTML;
    var mime = Mime.lookup(file_name);
    return mime && mime.startsWith('image')
  },
  showPane: function(initial_call = true) {
    this.setFileError(null);

    var cbs = {
      success: (file) => {
        if (this.parent.activateItem) this.parent.activateItem(this)
        else this.file_view.className += ' active-item';
        this.file_preview.children[0].children[1].value = this.file_bar.firstChild.innerHTML; // File Rename Field
        var plainText = atob(file.content);
        this.file_preview.children[1].children[1].innerHTML = this.formatFileSize(plainText.length); // File Size
        this.file_preview.children[2].value = file.binary ? file.content : plainText; // File Editor
        this.isBinary = file.binary;
        this.pane_shown = true;
        if (!file.binary) {
          this.file_preview.children[2].style.display = 'block';
        } else {
          this.file_preview.children[2].style.display = 'none';
        }
        if (this.isImage()) {
          this.file_preview.children[3].style.display = 'block';
          this.file_preview.children[3].firstChild.setAttribute('src', this.options.jsoneditor.options.task.getFileUrl(this.input.value));
          this.file_preview.children[3].firstChild.addEventListener('load', () => this.setEqualHeigths());
        } else {
          this.file_preview.children[3].style.display = 'none';
        }
        this.setEqualHeigths();
      },
      failure: (error) => {
        this.setFileError(error);
      }
    }
    this.jsoneditor.options.task.getContent(
      this.input.value,
      cbs
    );

    var translate_pair = this.getOtherTranslatePair();
    initial_call && translate_pair && translate_pair.showPane(false);
  },
  hidePane: function(e, initial_call = true) {
    if (e) e.stopPropagation();

    this.pane_shown = false;
    if (this.parent.deactivateItem) this.parent.deactivateItem(this);
    else this.file_view.className = this.file_view.className.replace(/\s*active-item/g, '');

    if (this.value === '') {
      this.file_view.className += ' no-file';
      if (this.temporary_array_item) this.parent.deleteItem(this);
    }

    var translate_pair = this.getOtherTranslatePair();
    initial_call && translate_pair && translate_pair.hidePane(null, false);
    this.setEqualHeigths();
  },
  setModifyEnabled: function(enabled) {
    var file_name = this.file_preview.children[0].children[1];
    var file_content = this.file_preview.children[2];
    this.modify_in_progress = enabled;
    file_name.disabled = enabled;
    file_content.disabled = enabled;
  },
  renameFile: function() {
    this.setFileError(null);
    var file_name = this.file_preview.children[0].children[1];
    var file_content = this.file_preview.children[2];
    if(file_name.value.trim() == '' || this.modify_in_progress) return;
    var old_filename = this.options.path + '.' + this.getLanguage() + '.' + this.file_bar.firstChild.innerHTML;
    var new_filename = this.options.path + '.' + this.getLanguage() + '.' + file_name.value;
    this.setModifyEnabled(true);
    var cbs = {
      success: () => {
        this.setModifyEnabled(false);
        this.setValue(new_filename);
        if (this.temporary_array_item) this.temporary_array_item = false;
        if (this.new_file) {
          this.new_file = false;
          this.file_preview.children[2].disabled = false;
        }
      },
      failure: (error) => {
        this.setModifyEnabled(false);
        this.setFileError(error);
      }
    }
    this.jsoneditor.options.task.setContent(
      old_filename,
      new_filename,
      this.isBinary ? file_content.value : btoa(file_content.value),
      cbs
    );
  },
  modifyContent: function() {
    this.setFileError(null);
    var file_content = this.file_preview.children[2];
    if(this.modify_in_progress) return;
    var old_filename = this.options.path + '.' + this.getLanguage() + '.' + this.file_bar.firstChild.innerHTML;
    this.setModifyEnabled(true);
    var cbs = {
      success: () => {
        this.setModifyEnabled(false);
        this.setValue(old_filename);
        this.file_preview.children[1].children[1].innerHTML = this.formatFileSize(file_content.value.length); // File Size
      },
      failure: (error) => {
        this.setModifyEnabled(false);
        this.setFileError(error);
      }
    }
    this.jsoneditor.options.task.setContent(
      old_filename,
      old_filename,
      this.isBinary ? file_content.value : btoa(file_content.value),
      cbs
    );
  },
  enable: function() {
    this.file_preview.children[0].children[1].disabled = false;
    this.file_preview.children[2].disabled = false;
    if(this.uploader) this.uploader.disabled = false;
    this._super();
  },
  disable: function() {
    this.file_preview.children[0].children[1].disabled = true;
    this.file_preview.children[2].disabled = true;
    if(this.uploader) this.uploader.disabled = true;
    this._super();
  },
  setValue: function(val) {
    if(this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      if (val === '') this.file_view.className += ' no-file';
      else {
        this.file_view.className = this.file_view.className.replace(/\s*no-file/g, '');
      }
      var file_name = this.input.value.substr(this.options.path.length + 1);
      var lang_prefix = this.getLanguage() + '.';
      var original_prefix = this.getOriginalLanguage() + '.';
      if (file_name.startsWith(lang_prefix)) file_name = file_name.substr(lang_prefix.length);
      else if (file_name.startsWith(original_prefix)) file_name = file_name.substr(original_prefix.length);
      this.file_bar.firstChild.innerHTML = file_name;
      if (this.pane_shown) {
        this.hidePane();
        this.showPane();
      }
      this.file_view.className = this.file_view.className.replace(/\s*image-file/g, '');
      this.container.parentNode.className = this.container.parentNode.className.replace(/\s*image-file-container/g, '');
      if (this.isImage()) {
        this.file_view.className += ' image-file';
        this.container.parentNode.className += ' image-file-container';
        this.file_bar.children[1].setAttribute('src', this.options.jsoneditor.options.task.getFileUrl(val));
        this.file_bar.children[1].addEventListener('load', () => this.setEqualHeigths());
      }
      this.onChange();
      if(this.parent) this.parent.onChildEditorChange(this);
      else this.jsoneditor.onChange();
      if (!val) {
        this.readonly_view.textContent = '[None]';
        this.readonly_view.style.display = null;
      } else {
        this.readonly_view.textContent = '';
        this.readonly_view.style.display = 'none';
      }
    }
    this.setEqualHeigths();
  },
  destroy: function() {
    if(this.preview && this.preview.parentNode) this.preview.parentNode.removeChild(this.preview);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.file_view && this.file_view.parentNode) this.file_view.parentNode.removeChild(this.file_view);
    if(this.uploader && this.uploader.parentNode) this.uploader.parentNode.removeChild(this.uploader);
    if(this.editor && this.editor.parentNode) this.editor.parentNode.removeChild(this.editor);
    if(this.btn_toggle_editor && this.btn_toggle_editor.parentNode) this.btn_toggle_editor.parentNode.removeChild(this.btn_toggle_editor);
    this._super();
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
      setTimeout(setHeight, 0);
    }
  },
  getLanguage: function() {
    var isTranslate = this.container.className.search(/\s*translate-field/g) > -1 || (this.parent && this.parent.container.className.search(/\s*translate-field/g) > -1);
    if (!isTranslate) return this.getOriginalLanguage();

    var root = this;
    while (root.parent) root = root.parent;
    return root.translate_to;
  },
  getOriginalLanguage: function() {
    return 'orig';
  }
});
