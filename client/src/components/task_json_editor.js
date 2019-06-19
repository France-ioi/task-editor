import React from 'react';
require('json-editor');
import files_api from '../api/files';


class TaskJsonEditor extends React.Component {

    componentDidMount() {
        const self = this;
        this.editor = new JSONEditor(this.element, {
            theme: 'taskeditor',
            schema: this.props.task.schema,
            disable_properties: true,
            display_required_only: false,
            //disable_edit_json: true,
            disable_array_delete_last_row: true,
            disable_array_delete_all_rows: true,
//            disable_array_reorder: true,
            startval: this.props.task.data,
            upload: this.editorUpload,
            keep_oneof_values: false,
            task: {
                getFileUrl: (filename) => {
                    return [
                        window.__CONFIG__.url_prefix,
                        this.props.task.path,
                        window.__CONFIG__.task.tmp_dir,
                        filename
                    ].join('/')
                },
                getContent: this.editorGetContent,
                setContent: this.editorSetContent,
                path: this.props.task.path
            }
        });
        this.editor.on('change', () => {
            this.props.onChange(this.editor.getValue());
        });
    }


    editorUpload = (type, file, cbs) => {
        cbs.updateProgress();
        files_api.upload({
            path: this.props.task.path,
            json_path: type,
            file
        }).then((res) => {
            cbs.success(res.filename);
        }).catch((err) => {
            //TODO: why cbs.failure wont work?
            cbs.failure(err.message);
        });
    }


    editorGetContent = (filename, cbs) => {
        files_api.getContent({
            path: this.props.task.path,
            filename
        }).then((res) => {
            cbs.success(res);
        }).catch((err) => {
            cbs.failure(err.message);
        });
    }


    editorSetContent = (old_filename, new_filename, content, cbs) => {
        files_api.setContent({
            path: this.props.task.path,
            old_filename,
            new_filename,
            content
        }).then((res) => {
            cbs.success();
        }).catch((err) => {
            cbs.failure(err.message);
        });
    }


    taskDataUpdate = () => {
        this.props.onChange(this.editor.getValue());
    }


    componentWillUnmount() {
        this.editor.destroy();
    }


    render() {
        return (
            <div className='json-editor-container' ref={(el) => { this.element = el; }}></div>
        );
    }

}
export default TaskJsonEditor;
