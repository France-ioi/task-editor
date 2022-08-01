import React from 'react';
import { connect } from 'react-redux';
import Channel from 'jschannel';

import Layout from './layout';


class App extends React.Component {

    componentDidMount() {
        // Initialize communication
        if(window.parent === window) { 
            return; 
        }
        console.log('channel init')
        var channel = Channel.build({
            window: window.parent,
            origin: '*',
            scope: 'editor'
        });
        var that = this;
        channel.bind('delete', function(ctx, params) {
            if(!that.props.task.path) { return; }
            that.props.dispatch({
                type: 'EXPLORER_REMOVE_DIR',
                dir: that.props.task.path
            });
        });
        channel.bind('getHeight', function(ctx, params) {
            return document.getElementById('reactbody').offsetHeight;
        });
        channel.bind('getMetaData', function(ctx, params) {
            return {
                minWidth: 'auto',
                autoHeight: false
            };
        });
        this.props.dispatch({type: 'CHANNEL_SET', channel});
    }

    render() {
        return <Layout/>
    }

}

export default connect(
    state => state
)(App);
