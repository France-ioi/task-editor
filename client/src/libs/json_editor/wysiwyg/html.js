import images_api from '../../../api/images';

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



module.exports = function(params) {

    var instance;

    window.tinymce.init({
        target: params.element,
        auto_focus: params.autoFocus,
        plugins: 'autoresize image link codesample fullscreen lists textcolor colorpicker table code directionality',
        menubar: 'edit format',
        toolbar: 'view_mode image link codesample forecolor backcolor table numlist bullist | ltr rtl fullscreen code '  + (params.multitext ? 'markdown' : ''),
        branding: false,
        skin: false,
        directionality: params.directionality,
        codesample_content_css: 'assets/prism.css',
        content_css: 'assets/tinymce_custom.css',
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
        image_list: createImagesListHandler(params.path)
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
