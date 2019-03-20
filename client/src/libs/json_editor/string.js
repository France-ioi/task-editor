import images_api from '../../api/images';

function createImagesUploadHandler(path) {
    return function (blobInfo, success, failure) {
        var data = new FormData();
        data.append('file', blobInfo.blob(), blobInfo.filename());
        data.append('path', path);
        images_api.upload(data)
            .then(res => success(res.location))
            .catch(err => failure(err.message))
    }
}

function createImagesListHandler(path) {
    return function (success, failure) {
        images_api.search({ path })
            .then(res => success(res))
            .catch(err => failure(err.message))
    }
}


JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend({
    setValue: function(value,initial,from_template) {
        var self = this;

        if(this.template && !from_template) {
        return;
        }

        if(value === null || typeof value === 'undefined') value = "";
        else if(typeof value === "object") value = JSON.stringify(value);
        else if(typeof value !== "string") value = ""+value;

        if(value === this.serialized) return;

        // Sanitize value before setting it
        var sanitized = this.sanitize(value);

        if(this.input.value === sanitized) {
        return;
        }

        this.input.value = sanitized;

        if(this.tinymce_instance) {
            this.tinymce_instance.setContent(sanitized);
        } else if(this.epiceditor) {
            this.epiceditor.importFile(null,sanitized);
        } else if(this.ace_editor) {
            this.ace_editor.setValue(sanitized);
        }

        var changed = from_template || this.getValue() !== value;

        this.refreshValue();

        if(initial) this.is_dirty = false;
        else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

        if(this.adjust_height) this.adjust_height(this.input);

        // Bubble this setValue to parents if the value changed
        this.onChange(changed);
    },


    afterInputReady: function() {
        var self = this, options;

        // Code editor
        if(this.source_code) {
            // WYSIWYG html and bbcode editor
            if(this.options.wysiwyg &&
                ['html','bbcode'].indexOf(this.input_type) >= 0 &&
                window.tinymce) {

                // do not forget to add plugins to webpack.config.js > vendor
                window.tinymce.init({
                    target: self.input,
                    menubar: 'edit format',
                    plugins: 'image link codesample fullscreen lists textcolor colorpicker table ' + (self.input_type === 'bbcode' ? 'bbcode' : ''),
                    toolbar: 'image link codesample forecolor backcolor table numlist bullist fullscreen',
                    branding: false,
                    skin: false,
                    setup: function(editor) {
                        self.tinymce_instance = editor;
                        editor.on('blur', function(e) {
                            self.input.value = this.getContent();
                            self.value = self.input.value;
                            self.is_dirty = true;
                            self.onChange(true);
                        });
                    },
                    automatic_uploads: false,
                    file_picker_types: 'image',
                    images_upload_handler: createImagesUploadHandler(self.jsoneditor.options.task.path),
                    images_reuse_filename: true,
                    image_list: createImagesListHandler(self.jsoneditor.options.task.path)
                });

            } else if (this.input_type === 'markdown' && window.EpicEditor) {
                this.epiceditor_container = document.createElement('div');
                this.input.parentNode.insertBefore(this.epiceditor_container,this.input);
                this.input.style.display = 'none';

                options = $extend({},JSONEditor.plugins.epiceditor,{
                    container: this.epiceditor_container,
                    clientSideStorage: false
                });

                this.epiceditor = new window.EpicEditor(options).load();

                this.epiceditor.importFile(null,this.getValue());

                this.epiceditor.on('update',function() {
                    var val = self.epiceditor.exportFile();
                    self.input.value = val;
                    self.value = val;
                    self.is_dirty = true;
                    self.onChange(true);
                });
            } else if(window.ace) {
                var mode = this.input_type;
                // aliases for c/cpp
                if(mode === 'cpp' || mode === 'c++' || mode === 'c') {
                    mode = 'c_cpp';
                }

                this.ace_container = document.createElement('div');
                this.ace_container.style.width = '100%';
                this.ace_container.style.position = 'relative';
                this.ace_container.style.height = '400px';
                this.input.parentNode.insertBefore(this.ace_container,this.input);
                this.input.style.display = 'none';
                this.ace_editor = window.ace.edit(this.ace_container);

                this.ace_editor.setValue(this.getValue());

                // The theme
                if(JSONEditor.plugins.ace.theme) this.ace_editor.setTheme('ace/theme/'+JSONEditor.plugins.ace.theme);
                // The mode
                mode = window.ace.require("ace/mode/"+mode);
                if(mode) this.ace_editor.getSession().setMode(new mode.Mode());

                // Listen for changes
                this.ace_editor.on('change',function() {
                    var val = self.ace_editor.getValue();
                    self.input.value = val;
                    self.refreshValue();
                    self.is_dirty = true;
                    self.onChange(true);
                });
            }
        }

        self.theme.afterInputReady(self.input);
    },


    destroy: function() {
        if(this.tinymce_instance) {
            this.tinymce_instance.remove();
        } else if(this.epiceditor) {
            this.epiceditor.unload();
        } else if(this.ace_editor) {
            this.ace_editor.destroy();
        }

        this.template = null;
        if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
        if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
        if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);

        this._super();
    }

});


