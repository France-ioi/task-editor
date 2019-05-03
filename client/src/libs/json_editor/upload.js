JSONEditor.defaults.editors.upload = JSONEditor.AbstractEditor.extend({
  getNumColumns: function() {
    return 4;
  },
  build: function() {
    var self = this;
    this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());

    // Input that holds the base64 string
    this.input = this.theme.getFormInputField('hidden');
    this.container.appendChild(this.input);
    this.file_view = this.theme.getFileView();
    this.file_bar = this.file_view.children[0];
    this.file_preview = this.file_view.children[1];

    this.file_bar.firstChild.addEventListener('click', this.showPane.bind(this));
    this.file_bar.lastChild.addEventListener('click', this.hidePane.bind(this));
    this.file_preview.children[0].children[1].addEventListener('blur', this.renameFile.bind(this));
    this.file_preview.children[2].addEventListener('blur', this.modifyContent.bind(this));

    // Don't show uploader if this is readonly
    if(!this.schema.readOnly && !this.schema.readonly) {
      if(!this.jsoneditor.options.upload) throw "Upload handler required for upload editor";

      // File uploader

      false && this.uploader.addEventListener('change',function(e) {
        e.preventDefault();
        e.stopPropagation();

        if(this.files && this.files.length) {
          var fr = new FileReader();
          fr.onload = function(evt) {
            self.preview_value = evt.target.result;
            self.refreshPreview();
            self.onChange(true);
            fr = null;
          };
          fr.readAsDataURL(this.files[0]);
        }
      });
    }

    var description = this.schema.description;
    if (!description) description = '';

    this.preview = this.theme.getFormInputDescription(description);
    this.container.appendChild(this.preview);

    this.control = this.theme.getFormControl(this.label, this.file_bar, this.preview);
    this.container.appendChild(this.control);

    if(this.schema.options.editor) {
      this.editor = document.createElement('div');
      this.editor_filename = this.theme.getFormInputField('text');
      this.editor.appendChild(
        this.theme.getFormControl(
          this.theme.getFormInputLabel('File name'),
          this.editor_filename
        )
      );
      this.editor_content = this.theme.getTextareaInput();
      this.editor_content.style.height = '200px';
      this.btn_save_editor = this.theme.getButton('Save');
      this.btn_save_editor.addEventListener('click', this.saveEditor.bind(this));
      this.editor.appendChild(
        this.theme.getFormControl(
          this.theme.getFormInputLabel('File content'),
          this.editor_content,
          this.btn_save_editor
        )
      );
      this.editor.style.display = 'none';
      this.editor_mode = false;
      this.container.appendChild(this.editor);
    }
  },
  setEditorError: function(msg) {
    if(!msg) {
        this.editor_error && this.editor_error.parentNode.removeChild(this.editor_error);
        this.editor_error = null;
        return;
    }
    if(!this.editor_error) {
      this.editor_error = document.createElement('div');
      this.editor_error.className = 'alert alert-danger';
      this.editor.appendChild(this.editor_error);
    }
    this.editor_error.textContent = msg;
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
  showPane: function() {
    this.setEditorError(null);

    var cbs = {
      success: (file) => {
        this.old_filename = this.input.value;
        this.file_view.className += ' open-preview';
        this.file_preview.children[0].children[1].value = this.file_bar.firstChild.innerHTML; // File Rename Field
        this.file_preview.children[1].children[1].innerHTML = this.formatFileSize(file.content.length); // File Size
        this.file_preview.children[2].value = file.content; // File Editor
        if (!file.binary) {
          this.file_preview.children[2].style.display = 'block';
        }
      },
      failure: (error) => {
        this.setEditorError(error);
        this.file_preview.style.display = '';
      }
    }
    this.jsoneditor.options.task.getContent(
      this.input.value,
      cbs
    );
  },
  hidePane: function() {
    this.file_view.className = this.file_view.className.replace(/\s*open-preview/g, '');
  },
  setModifyEnabled: function(enabled) {
    var file_name = this.file_preview.children[0].children[1];
    var file_content = this.file_preview.children[2];
    this.modify_in_progress = enabled;
    file_name.disabled = enabled;
    file_content.disabled = enabled;
  },
  renameFile: function() {
    this.setEditorError(null);
    var file_name = this.file_preview.children[0].children[1];
    var file_content = this.file_preview.children[2];
    if(file_name.value.trim() == '' || this.modify_in_progress) return;
    var new_filename = this.options.path + '.' + file_name.value;
    this.setModifyEnabled(true);
    var cbs = {
      success: () => {
        this.setModifyEnabled(false);
        this.setValue(new_filename);
        if(this.parent) {
          this.parent.onChildEditorChange(this);
        } else {
          this.jsoneditor.onChange();
        }
        this.old_filename = new_filename;
      },
      failure: (error) => {
        this.setModifyEnabled(false);
        this.setEditorError(error);
      }
    }
    this.jsoneditor.options.task.setContent(
      this.old_filename,
      new_filename,
      file_content.value,
      cbs
    );
  },
  modifyContent: function() {
    this.setEditorError(null);
    var file_content = this.file_preview.children[2];
    if(this.modify_in_progress) return;
    this.setModifyEnabled(true);
    var cbs = {
      success: () => {
        this.setModifyEnabled(false);
        this.file_preview.children[1].children[1].innerHTML = this.formatFileSize(file_content.value.length); // File Size
      },
      failure: (error) => {
        this.setModifyEnabled(false);
        this.setEditorError(error);
      }
    }
    this.jsoneditor.options.task.setContent(
      this.old_filename,
      this.old_filename,
      file_content.value,
      cbs
    );
  },
  saveEditor: function(e) {
    this.setEditorError(null);
    if(this.editor_filename.value.trim() == '') return;
    this.btn_save_editor.setAttribute('disabled', 'disabled');
    var new_filename = this.options.path + '.' + this.editor_filename.value;
    var cbs = {
      success: (content) => {
        this.btn_save_editor.removeAttribute('disabled');
        this.setValue(new_filename);
        if(this.parent) {
          this.parent.onChildEditorChange(this);
        } else {
          this.jsoneditor.onChange();
        }
      },
      failure: (error) => {
        this.btn_save_editor.removeAttribute('disabled');
        this.setEditorError(error);
      }
    }
    this.jsoneditor.options.task.setContent(
      this.old_filename,
      new_filename,
      this.editor_content.value,
      cbs
    );
  },
  refreshPreview: function() {
    if(this.last_preview === this.preview_value) return;
    this.last_preview = this.preview_value;

    this.preview.innerHTML = '';

    if(!this.preview_value) return;

    var self = this;

    var mime = this.preview_value.match(/^data:([^;,]+)[;,]/);
    if(mime) mime = mime[1];
    if(!mime) mime = 'unknown';

    var file = this.uploader.files[0];

    this.preview.innerHTML = '<strong>Type:</strong> '+mime+', <strong>Size:</strong> '+file.size+' bytes';
    if(mime.substr(0,5)==="image") {
      this.preview.innerHTML += '<br>';
      var img = document.createElement('img');
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100px';
      img.src = this.preview_value;
      this.preview.appendChild(img);
    }

    this.preview.innerHTML += '<br>';
    var uploadButton = this.getButton('Upload', 'upload', 'Upload');
    this.preview.appendChild(uploadButton);
    uploadButton.addEventListener('click',function(event) {
      event.preventDefault();

      uploadButton.setAttribute("disabled", "disabled");
      self.theme.removeInputError(self.uploader);

      if (self.theme.getProgressBar) {
        self.progressBar = self.theme.getProgressBar();
        self.preview.appendChild(self.progressBar);
      }

      self.jsoneditor.options.upload(self.path, file, {
        success: function(url) {
          self.setValue(url);

          if(self.parent) self.parent.onChildEditorChange(self);
          else self.jsoneditor.onChange();

          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        failure: function(error) {
          self.theme.addInputError(self.uploader, error);
          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        updateProgress: function(progress) {
          if (self.progressBar) {
            if (progress) self.theme.updateProgressBar(self.progressBar, progress);
            else self.theme.updateProgressBarUnknown(self.progressBar);
          }
        }
      });
    });
  },
  enable: function() {
    this.file_view.disabled = true;
    if(this.uploader) this.uploader.disabled = false;
    this._super();
  },
  disable: function() {
    this.file_view.disabled = false;
    if(this.uploader) this.uploader.disabled = true;
    this._super();
  },
  setValue: function(val) {
    if(this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      this.file_bar.firstChild.innerHTML = this.input.value.substr(this.options.path.length + 1);
      this.onChange();
    }
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
  getLink: function(data) {
    var link = this.theme.getBlockLink();
    link.setAttribute('target', '_blank');
    this.link_watchers.push((vars) => {
      var url = '';
      var filename = '';
      if(vars.self) {
        url = this.options.jsoneditor.options.task.getFileUrl(vars.self);
        filename = vars.self.substr(this.options.path.length + 1);
      }
      link.setAttribute('href', url);
      link.textContent = filename;
    });
    return link;
  }
});
