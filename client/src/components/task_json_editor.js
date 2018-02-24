import React from 'react';
require('json-editor');

import schema from '../common/task_schema.json'
import files_api from '../api/files';

class TaskJsonEditor extends React.Component {


    componentDidMount() {
        const self = this;
        this.editor = new JSONEditor(this.element, {
            theme: 'bootstrap3',
            schema,
            disable_properties: true,
            upload: true,
            startval: this.props.task.data,

            upload: function(type, file, cbs) {
                cbs.updateProgress();
                files_api.upload({
                    path: self.props.task.path,
                    json_path: type,
                    file
                }).then((res) => {
                    cbs.success(res.filename);
                }).catch((err) => {
                    //TODO: why cbs.failure wont work?
                    cbs.failure(err.message);
                });
            }
        });
        this.editor.on('change', () => {
            this.refreshLinks();
            this.props.onChange(this.editor.getValue());
        });
    }


    refreshLinks = () => {
        // workaround for links :)
        var links = document.getElementsByClassName('json-file-link');
        for(var i=0; i<links.length; i++) {
            links[i].href = window.__CONFIG__.url_prefix +
                this.props.task.path + '/' +
                window.__CONFIG__.task.tmp_dir + '/' +
                links[i].innerText;
        }
    }


    taskDataUpdate = () => {
        this.props.onChange(this.editor.getValue());
    }


    componentWillUnmount() {
        this.editor.destroy();
    }


    render() {
        return (
            <div ref={(el) => { this.element = el; }}></div>
        );
    }

}
export default TaskJsonEditor;