import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';

class TaskSvn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }


    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    exec = (e) => {
        this.props.dispatch({
            type: 'SVN_FETCH',
            path: this.props.path,
            cmd: e.target.name,
            message: this.state.message
        });
    }

    render() {
        const output = this.props.data ?  '>' + this.props.data.cmd + '\n' + this.props.data.out : null;

        return (
            <div>
                <FormGroup>
                    <Button name="update" onClick={this.exec}>Update</Button>
                    {' '}
                    <Button name="add" onClick={this.exec}>Add</Button>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Message</ControlLabel>
                    <FormControl type="text" name="message" value={this.state.message} onChange={this.onInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Button name="commit" onClick={this.exec}>Commit</Button>
                </FormGroup>
                { output && <pre className="console-output">{output}</pre>}
                { this.props.error && <Alert bsStyle="danger">{this.props.error}</Alert> }
            </div>
        )
    }

}

export default connect(
    state => state.svn
)(TaskSvn);