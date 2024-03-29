import values_cache from './values_cache';

JSONEditor.TaskEditorAbstractEditor = JSONEditor.AbstractEditor.extend({


    getDefault: function() {
        if(this.options.value_source && this.options.value_source in this.jsoneditor.options.values_source) {
            return this.jsoneditor.options.values_source[this.options.value_source];
        } else if(this.options.cache_value) {
            var cached_value = values_cache.get(this.path);
            if(cached_value !== null) {
                return cached_value;
            }
        }
        return this._super();
    },


    change: function() {
        if(this.options.cache_value) {
            values_cache.set(this.path, this.value);
        }
        this._super();
    }

 })