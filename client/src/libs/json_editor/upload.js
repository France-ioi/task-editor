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

        // Don't show uploader if this is readonly
        if(!this.schema.readOnly && !this.schema.readonly) {

            if(!this.jsoneditor.options.upload) throw "Upload handler required for upload editor";

            // File uploader
            this.uploader = this.theme.getFormInputField('file');

            this.uploader.addEventListener('change',function(e) {
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

        if(this.schema.options.editor) {
            this.btn_toggle_editor = this.theme.getButton('Toggle editor');
            this.btn_toggle_editor.addEventListener('click', this.toggleEditor.bind(this));
            this.container.appendChild(this.btn_toggle_editor);
        }


        this.control = this.theme.getFormControl(this.label, this.uploader||this.input, this.preview);
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


    toggleEditor: function(e) {
        e.preventDefault();
        this.editor_mode = !this.editor_mode;
        if(this.editor_mode) {
            this.showEditor();
        } else {
            this.hideEditor();
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


    showEditor: function() {
        this.setEditorError(null);
        this.control.style.display = 'none';
        if(!this.input.value) {
            this.editor_filename.value = '';
            this.editor_content.value = '';
            this.editor.style.display = '';
            return;
        }
        this.btn_toggle_editor.setAttribute('disabled', 'disabled');

        var cbs = {
            success: (content) => {
                this.old_filename = this.input.value;
                this.editor_filename.value = this.input.value.substr(this.options.path.length + 1);
                this.editor_content.value = content;
                this.editor.style.display = '';
                this.btn_toggle_editor.removeAttribute('disabled');
            },
            failure: (error) => {
                this.setEditorError(error);
                this.editor.style.display = '';
            }
        }
        this.jsoneditor.options.task.getContent(
            this.input.value,
            cbs
        );
    },


    hideEditor: function() {
        this.editor.style.display = 'none';
        this.control.style.display = '';
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
        if(this.uploader) this.uploader.disabled = false;
        this._super();
    },


    disable: function() {
        if(this.uploader) this.uploader.disabled = true;
        this._super();
    },


    setValue: function(val) {
        if(this.value !== val) {
            this.value = val;
            this.input.value = this.value;
            this.onChange();
        }
    },


    destroy: function() {
        if(this.preview && this.preview.parentNode) this.preview.parentNode.removeChild(this.preview);
        if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
        if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
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