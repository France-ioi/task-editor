import HTMLEditor from './wysiwyg/html'

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

        this.html_editor && this.html_editor.setContent(sanitized)

        var changed = from_template || this.getValue() !== value;

        this.refreshValue();

        if(initial) this.is_dirty = false;
        else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

        if(this.adjust_height) this.adjust_height(this.input);

        // Bubble this setValue to parents if the value changed
        this.onChange(changed);
    },


    afterInputReady: function() {
        var self = this;
        if(this.options.wysiwyg && ['html','bbcode'].indexOf(this.input_type) >= 0) {
            this.html_editor = HTMLEditor({
                element: this.input,
                path: this.jsoneditor.options.task.path,
                options: this.options,
                onChange: function(content) {
                    self.input.value = content;
                    self.value = self.input.value;
                    self.is_dirty = true;
                    self.onChange(true);
                }
            })
        }
        self.theme.afterInputReady(self.input);
    },


    destroy: function() {
        this.html_editor && this.html_editor.destroy();
        this.template = null;
        if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
        if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
        if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);

        this._super();
    }

})