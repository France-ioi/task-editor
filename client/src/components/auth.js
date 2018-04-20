import React from 'react';
import { connect } from 'react-redux';
import { Panel, Alert, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Loader from './ui/loader';

var dev = window.__CONFIG__.dev;

class Auth extends React.Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            username: dev.username || '',
            password: dev.password || '',
            svn_update: false
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
            [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value
        })
    }


    login = (e) => {
        e && e.preventDefault();
        this.props.dispatch({
            type: 'AUTH_LOGIN_REQUEST',
            username: this.state.username,
            password: this.state.password,
            svn_update: this.state.svn_update
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
                        <form onSubmit={this.login}>
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
                            <Checkbox name="svn_update" onChange={this.onInputChange}>
                                Run svn update for existing folders
                            </Checkbox>
                            <FormGroup>
                                <Button bsStyle="primary" type="submit"
                                    disabled={username == '' || password == ''}>Login</Button>
                            </FormGroup>
                        </form>
                        <Alert bsStyle="info">Login may take a time to complete svn checkout/update.</Alert>
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