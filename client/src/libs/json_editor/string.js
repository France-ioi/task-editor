import images_api from '../../api/images';
import EasyMDE from 'easymde';
import converter from '../showdown_converter';

(function() {

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


    function initHTMLEditor(string_editor) {
        window.tinymce.init({
            target: string_editor.input,
            plugins: 'image link codesample fullscreen lists textcolor colorpicker table code' + (string_editor.input_type === 'bbcode' ? 'bbcode' : ''),
            menubar: 'edit format',
            toolbar: 'view_mode image link codesample forecolor backcolor table numlist bullist | fullscreen code markdown',
            branding: false,
            skin: false,
            codesample_content_css: 'assets/prism.css',
            setup: function(editor) {
                string_editor.html_editor = editor;
                editor.on('blur', function(e) {
                    string_editor.input.value = this.getContent();
                    string_editor.value = string_editor.input.value;
                    string_editor.is_dirty = true;
                    string_editor.onChange(true);
                });
                editor.addButton('markdown', {
                    title: 'Switch to markdown editor',
                    icon: 'markdown',
                    onclick: function() {
                        string_editor.input.value = editor.getContent();
                        string_editor.value = string_editor.input.value;
                        string_editor.setValueType('markdown')
                    }
                });
            },
            automatic_uploads: false,
            file_picker_types: 'image',
            images_upload_handler: createImagesUploadHandler(string_editor.jsoneditor.options.task.path),
            images_reuse_filename: true,
            image_list: createImagesListHandler(string_editor.jsoneditor.options.task.path)
        });
    }


    function initMarkdownEditor(string_editor) {
        string_editor.markdown_editor = new EasyMDE({
            element: string_editor.input,
            toolbar: [
                'bold',
                'italic',
                'strikethrough',
                '|',
                'heading',
                'heading-smaller',
                'heading-bigger',
                'heading-1',
                'heading-2',
                'heading-3',
                '|',
                'code',
                'quote',
                'unordered-list',
                'ordered-list',
                'clean-block',
                'link',
                'image',
                'table',
                'horizontal-rule',
                '|',
                'preview',
                'side-by-side',
                'fullscreen',
                '|',
                {
                    name: 'html_mode',
                    action: function customFunction(editor) {
                        string_editor.input.value = editor.value();
                        string_editor.value = string_editor.input.value;
                        string_editor.setValueType('html')
                    },
                    className: "fa fa-file-code-o",
                    title: 'Switch to HTML editor'
                }
            ]
        });
        string_editor.markdown_editor.codemirror.on('blur', function() {
            string_editor.input.value = string_editor.markdown_editor.value();
            string_editor.value = string_editor.input.value;
            string_editor.is_dirty = true;
            string_editor.onChange(true);
        });
    }


    function initEditor(string_editor) {
        if(string_editor.options.multitext && string_editor.value_type == 'markdown') {
            return initMarkdownEditor(string_editor)
        }
        return initHTMLEditor(string_editor)
    }


    function destroyEditor(string_editor) {
        if(string_editor.html_editor) {
            string_editor.html_editor.remove();
            string_editor.html_editor = null;
        } else if(string_editor.markdown_editor) {
            string_editor.markdown_editor.toTextArea();
            string_editor.markdown_editor = null;
        }
    }



    window.JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend({


        setValueType: function(type) {
            if(this.value_type == type) return;
            destroyEditor(this);
            this.value_type = type;
            initEditor(this);
            if(this.html_editor) {
                this.value = converter.makeHtml(this.value)
                this.html_editor.setContent(this.value);
            } else if(this.markdown_editor) {
                this.value = converter.makeMarkdown(this.value)
                this.markdown_editor.value(this.value);
            }
            this.is_dirty = true;
            this.onChange(true);
        },


        setValue: function(value, initial, from_template) {
            if(this.template && !from_template) return;

            if(this.options.multitext) {
                if(typeof value === "object") {
                    this.value_type = value.__type || 'html';
                    value = value.__value || '';
                } else {
                    this.value_type = 'html';
                    value = value || '';
                }
            } else if(value === null || typeof value === 'undefined') {
                value = ""
            } else if(typeof value === "object") {
                value = JSON.stringify(value);
            } else if(typeof value !== "string") {
                value = ""+value;
            }

            if(value === this.serialized) return;

            var sanitized = this.sanitize(value);
            if(this.input.value === sanitized) return;

            this.input.value = sanitized;

            if(this.html_editor) {
                this.html_editor.setContent(value);
            } else if(this.markdown_editor) {
                this.markdown_editor.value(value);
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
            if(this.options.wysiwyg) {
                initEditor(this);
            }
            this.theme.afterInputReady(this.input);
        },


        getValue: function() {
            if(this.options.multitext) {
                return {
                    __type: this.value_type,
                    __value: this.value
                }
            }
            return this.value;
        },


        destroy: function() {
            destroyEditor(this);
            this.template = null;
            if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
            if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
            if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
            this._super();
        }

    });

})()