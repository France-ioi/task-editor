import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import Layout from './layout';
import Auth from './auth';


class App extends React.Component {

    render() {
        if(this.props.token === null) {
            return <Auth/>
        }
        return <Layout/>
    }

}

export default connect(
    state => state.auth
)(App);