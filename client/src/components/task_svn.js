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
        // Remove trailing '/'
        var path = this.props.path.indexOf('/') == 0 ? this.props.path.substr(1) : this.props.path;
        this.props.dispatch({
            type: 'SVN_FETCH',
            path: path,
            cmd: e.target.name,
            message: this.state.message
        });
    }

    render() {
        const output = this.props.data ?  '>' + this.props.data.cmd + '\n' + this.props.data.out : null;

        return (
            <div className="container">
                <FormGroup>
                    <Button name="update" onClick={this.exec}>Update</Button>
                    <i> Fetch files from the SVN into task-editor's copy.</i>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Commit message</ControlLabel>
                    <FormControl type="text" name="message" placeholder="Message for the SVN commit" value={this.state.message} onChange={this.onInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Button name="commit" bsStyle="primary" onClick={this.exec}>Commit</Button>
                    <i> Save changes onto the SVN; automatically adds new files.</i>
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
