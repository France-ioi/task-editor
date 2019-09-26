import React from 'react';


class TaskViewer extends React.Component {

    render() {
        const url = window.__CONFIG__.url_prefix + '/' + this.props.task_path + '/index.html?_=' + Math.random();
        return (
            <div className="task-viewer">
                <iframe src={url}/>
            </div>
        );
    }

}

export default TaskViewer;