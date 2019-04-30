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
        plugins: 'image link codesample fullscreen lists textcolor colorpicker table code',
        menubar: 'edit format',
        toolbar: 'view_mode image link codesample forecolor backcolor table numlist bullist | fullscreen code '  + (params.multitext ? 'markdown' : ''),
        branding: false,
        skin: false,
        codesample_content_css: 'assets/prism.css',
        content_css: 'assets/tinymce_custom.css',
        setup: function(editor) {
            instance = editor;
            editor.on('init blur', function() {
                params.onChange && params.onChange(editor.getContent(), editor.getContent({format : 'text'}));
            });
            editor.on('blur', function() {
                params.onBlur && params.onBlur();
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
            instance && instance.setContent(content)
        }

    }
}
