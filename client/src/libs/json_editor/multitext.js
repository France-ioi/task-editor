import HTMLEditor from './wysiwyg/html'
import MarkdownEditor from './wysiwyg/markdown'
import converter from '../showdown_converter'

window.JSONEditor.defaults.editors.multitext = JSONEditor.defaults.editors.string.extend({


    initWysiwyg: function(focus) {
        var self = this;
        var func = this.value_type == 'markdown' ? MarkdownEditor : HTMLEditor;
        var root = this;
        while (root.parent) root = root.parent;
        this.wysiwyg = func({
            element: this.input,
            autoFocus: focus && (this.input.id || true),
            directionality: root.isRTL ? 'rtl' : 'ltr',
            path: this.jsoneditor.options.task.path,
            multitext: true,
            onChange: function(content) {
                self.input.parentNode.children[1].innerHTML = converter.makeHtml(content);
                self.input.value = content;
                self.value = self.input.value;
                self.is_dirty = true;
                self.refreshValue();
                self.onChange(true);
            },
            onResize: function() {
                self.setEqualHeigths();
            },
            onTypeChange: function(type, content) {
                self.input.value = content;
                self.value = content;
                self.setValueType(type)
            }
        })
    },


    setValueType: function(type) {
        if(this.value_type == type) return;
        this.value_type = type;
        this.initWysiwyg();
        if(type == 'html') {
            this.value = converter.makeHtml(this.value)
        } else if(type == 'markdown') {
            this.value = converter.makeMarkdown(this.value)
        }
        this.wysiwyg.setContent(this.value);
        this.is_dirty = true;
        this.onChange(true);
    },


    setValue: function(value, initial, from_template) {
        if(value === null) {
            this.value_type = 'html';
            value = '';
        } else if(typeof value === "object") {
            this.value_type = value.__type || 'html';
            value = value.__value || '';
        } else {
            this.value_type = 'html';
            value = value || '';
        }

        var sanitized = this.sanitize(value);
        if(this.input.value === sanitized) return;

        this.input.value = sanitized;

        this.wysiwyg && this.wysiwyg.setContent(value)

        var changed = from_template || this.getValue() !== value;

        this.refreshValue();

        if(initial) this.is_dirty = false;
        else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

        if(this.adjust_height) this.adjust_height(this.input);

        // Bubble this setValue to parents if the value changed
        this.onChange(changed);

    },


    afterInputReady: function(focus) {
        this.wysiwyg && this.wysiwyg.destroy();
        this.initWysiwyg(focus);
        this.theme.afterInputReady(this.input);
    },


    getValue: function() {
        return {
            __type: this.value_type,
            __value: this.value
        }
    },


    destroy: function() {
        this.wysiwyg && this.wysiwyg.destroy();
        this.template = null;
        if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
        if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
        if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
        this._super();
    }


})
