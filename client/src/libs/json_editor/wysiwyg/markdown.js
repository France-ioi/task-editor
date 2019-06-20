import EasyMDE from 'easymde';

var default_toolbar = [
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
    '|'
];

module.exports = function(params) {

    var instance;
    var toolbar = default_toolbar.slice(0);
    if(params.multitext) {
        var btn = {
            name: 'html_mode',
            action: function customFunction(editor) {
                params.onTypeChange && params.onTypeChange('html', editor.value())
            },
            className: "fa fa-file-code-o",
            title: 'Switch to HTML editor'
        }
        toolbar = toolbar.concat([btn]);
    }
    instance = new EasyMDE({
        element: params.element,
        toolbar: toolbar,
        minHeight: '100px',
        autofocus: !!params.autoFocus
    })
    instance.codemirror.on('blur', function() {
        params.onChange && params.onChange(instance.value())
    })
    instance.codemirror.on('change', function() {
        params.onChange && params.onChange(instance.value())
    })
    instance.codemirror.on('refresh', function() {
        params.onResize && params.onResize()
    })


    return {

        destroy: function() {
            instance && instance.toTextArea()
            instance = null
        },

        setContent: function(content) {
            if (instance) {
              instance.value(content);
              params.onChange && params.onChange(content);
            }
        }
    }

}
