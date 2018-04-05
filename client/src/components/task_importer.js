import React from 'react';


class TaskImporter extends React.Component {


    getUrl = () => {
        var params = Object.assign({
            path: this.props.path,
            token: this.props.token
        }, window.__CONFIG__.task_importer_params);
        var q = [];
        for(var k in params) {
            if(params.hasOwnProperty(k)) {
                q.push(k + '=' + encodeURIComponent(params[k]));
            }
        }
        return window.__CONFIG__.task_importer.url + '?' + q.join('&');
    }


    render() {
        const url = this.getUrl();
        return (
            <div className="task-importer">
                <iframe
                    ref={(el) => { this.iframe = el; }}
                    src={url}>
                </iframe>
            </div>
        )
    }

}

export default TaskImporter;
