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

        this.props.dispatch({type: 'IMPORTER_GET_URL', path: this.props.path});

        var that = this;
        this.channel.bind('link', function(ctx, params) {
            that.props.dispatch({type: 'TASK_GOT_URL', url: params.url});
            });
    }


    render() {
        const { loading, url } = this.props.task_importer;
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
