import React from 'react';
import { connect } from 'react-redux';
import { Panel, Alert, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Loader from './ui/loader';

var dev = window.__CONFIG__.dev;

class Auth extends React.Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            username: dev.username || '',
            password: dev.password || ''
        };
    }


    componentDidMount = () => {
        // for test purpose
        if(dev.username) {
            this.login();
        }
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    login = (e) => {
        this.props.dispatch({
            type: 'AUTH_LOGIN_REQUEST',
            username: this.state.username,
            password: this.state.password
        });
    }

    render() {
        const { loading, error } = this.props;
        const { username, password} = this.state;
        return (
            <div className="auth-container">
                <Panel bsStyle="primary">
                    <Panel.Heading>Auth</Panel.Heading>
                    <Panel.Body>
                        { error && <Alert bsStyle="danger">{error}</Alert> }
                        <FormGroup>
                            <ControlLabel>Username</ControlLabel>
                            <FormControl type="text" name="username"
                                value={username} onChange={this.onInputChange}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type="password" name="password"
                                value={password} onChange={this.onInputChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Button bsStyle="primary" onClick={this.login}
                                disabled={username == '' || password == ''}>Login</Button>
                        </FormGroup>
                    </Panel.Body>
                </Panel>
                { loading && <Loader modal/> }
            </div>
        )
    }
}


export default connect(
    state => state.auth
)(Auth);