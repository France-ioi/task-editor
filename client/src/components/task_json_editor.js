import React from 'react';
require('json-editor');

import schema from '../task/schema'

class TaskJsonEditor extends React.Component {


    componentDidMount() {
        this.editor = new JSONEditor(this.element, {
            theme: 'bootstrap3',
            schema,
            startval: this.props.task.data
        });
        this.editor.on('change', this.taskDataUpdate.bind(this));
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