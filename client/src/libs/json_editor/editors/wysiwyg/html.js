import images_api from '../../../../api/images';

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


tinymce.PluginManager.add('placeholder', function(editor, url) {
    editor.addButton('placeholder', {
        icon: 'placeholder',
        onclick: function() {
            editor.insertContent('<span class="placeholder noneditable">&nbsp;</span>');
        }
    });
});



module.exports = function(params) {

    params.options = params.options || {};

    var instance;

    window.tinymce.init({
        target: params.element,
        auto_focus: params.autoFocus,
        plugins: 'autoresize image link codesample fullscreen lists textcolor colorpicker table code noneditable placeholder directionality',
        menubar: 'edit format',
        toolbar:
            'view_mode image link codesample forecolor backcolor table numlist bullist ' +
            (params.options.placeholder ? 'placeholder' : '') +
            ' | ltr rtl fullscreen code ' +
            (params.multitext ? 'markdown' : ''),

        branding: false,
        skin: false,
        directionality: params.directionality,
        codesample_content_css: '/assets/prism.css',
        content_css: '/assets/tinymce_content.css',
        noneditable_noneditable_class: 'noneditable',
        autoresize_min_height: 100,
        autoresize_max_height: 400,
        autoresize_bottom_margin: 4,
        setup: function(editor) {
            instance = editor;
            editor.on('init blur keydown cut paste setcontent', function() {
                params.onChange && params.onChange(editor.getContent());
            });
            editor.on('blur', function() {
                params.onBlur && params.onBlur();
            });
            editor.on('resizeeditor', function() {
                params.onResize && params.onResize();
            });
            if(params.multitext) {
                editor.addButton('markdown', {
                    title: 'Switch to markdown editor',
                    icon: 'markdown',
                    onclick: function() {
                        params.onTypeChange && params.onTypeChange('markdown', editor.getContent())
                    }
                });
            }
        },
        automatic_uploads: false,
        file_picker_types: 'image',
        images_upload_handler: createImagesUploadHandler(params.path),
        images_reuse_filename: true,
        image_list: createImagesListHandler(params.path),
        document_base_url: window.__CONFIG__.url_prefix + '/' + params.path + '/',
        relative_urls: true
    })

    return {

        destroy: function() {
            instance && instance.remove()
            instance = null
        },


        setContent: function(content) {
            if (instance) {
              instance.setContent(content)
              params.onChange && params.onChange(instance.getContent());
            }
        }

    }
}
