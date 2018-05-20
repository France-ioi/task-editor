import React from 'react';
import { connect } from 'react-redux';
import Channel from 'jschannel';


class TaskImporter extends React.Component {

    componentDidMount() {
        this.channel = Channel.build({
            window: this.iframe.contentWindow,
            origin: '*',
            scope: 'importer'
            });
        var that = this;
        this.channel.bind('link', function(ctx, params) {
            that.props.dispatch({type: 'TASK_GOT_URL', url: params.url});
            });
    }


    getUrl = () => {
        var params = Object.assign({
            path: this.props.path,
            token: this.props.token,
            display: 'frame',
            autostart: 1
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

export default connect(
    state => state
)(TaskImporter);
