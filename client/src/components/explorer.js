import React from 'react';
import { connect } from 'react-redux';
import { Button, DropdownButton, MenuItem, ButtonToolbar,
        Modal, Alert, Breadcrumb, Glyphicon, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import Loader from './ui/loader';
import Breadcrumbs from './ui/breadcrumbs';
import tasks_config from '../../../tasks/config.json';


function pathJoin(path1, path2) {
    return path1 == '' ? path2 : path1 + '/' + path2;
}


const List = (props) => {
    if(!props.list) return null;
    return (
        <div>
            {props.list.map(item =>
                item.type == 'dir' &&
                <div key={item.name}>
                    <a href="#"
                        onClick={()=>props.nav(pathJoin(props.path, item.name))}>
                        <Glyphicon glyph="folder-close" /> {item.name}
                    </a>
                </div>
            )}
        </div>
    )
}


class Explorer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            dir: ''
        };
    }


    componentWillReceiveProps(props) {
        if(!this.props.visible && props.visible) {
            this.navHome();
        }
    }

    nav = (path) => {
        if(path !== this.props.path) {
            this.props.dispatch({type: 'EXPLORER_FETCH_READ_DIR', path })
        }
    }

    navHome = () => {
        this.nav('');
    }


    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    createDir = () => {
        const { dir } = this.state;
        if(dir.trim() == '') return;
        this.state.dir = '';
        this.props.dispatch({type: 'EXPLORER_FETCH_CREATE_DIR', dir });
    }

    removeDir = () => {
        this.props.dispatch({type: 'EXPLORER_FETCH_REMOVE_DIR' });
    }


    loadTask = () => {
        this.props.toggle();
        this.props.loadTask(this.props.path);
    }


    createTask = (task_type) => {
        this.props.toggle();
        this.props.createTask(this.props.path, task_type);
    }

    render() {
        const is_home = !this.props.path;
        const { flags } = this.props;
        return (
            <Modal show={this.props.visible} onHide={this.props.toggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Select task folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { this.props.loading ? <Loader/> : <Breadcrumbs nav={this.nav} path={this.props.path}/>}
                    <List list={this.props.list} nav={this.nav} path={this.props.path}/>
                    { this.props.error && <Alert bsStyle="danger">{this.props.error}</Alert> }
                </Modal.Body>
                    { !is_home && <Modal.Footer>
                        <FormGroup>
                            <InputGroup>
                                <FormControl disabled={this.props.loading} type="text" name="dir"
                                    value={this.state.dir} onChange={this.onInputChange}/>
                                <InputGroup.Button>
                                    <Button disabled={this.props.loading} onClick={this.createDir}>Create dir</Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Modal.Footer>
                }
                <Modal.Footer>
                    { !is_home &&
                        <ButtonToolbar className="pull-left">
                            <Button onClick={this.navHome}>Go home</Button>
                            <Button bsStyle="danger" onClick={this.removeDir}>Delete dir</Button>
                        </ButtonToolbar>
                    }

                    <ButtonToolbar className="pull-right">
                    { flags.is_task &&
                        <Button onClick={this.loadTask} bsStyle="primary">Open task</Button>
                    }
                    { !flags.is_task && !flags.has_subfolders && !is_home &&
                        <DropdownButton bsStyle="default" title="Create task" noCaret dropup id="btn-create-task">
                            { tasks_config.map(task =>
                                <MenuItem key={task.type} onClick={()=>this.createTask(task.type)}>{task.title}</MenuItem>
                            )}
                        </DropdownButton>
                    }
                    <Button onClick={this.props.toggle}>Cancel</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default connect(
    state => state.explorer
)(Explorer);
