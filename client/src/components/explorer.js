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
            {props.list.filter(item => item.is_dir).map(item =>
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


    nav = (path) => {
        if(path !== this.props.path) {
            this.props.dispatch({type: 'EXPLORER_FETCH_READ_DIR', path })
        }
    }


    navHome = () => {
        this.nav('');
    }


    navRefresh = () => {
        this.props.dispatch({
            type: 'EXPLORER_FETCH_READ_DIR',
            path: this.props.path,
            refresh: true
        })
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
        this.props.dispatch({type: 'EXPLORER_REMOVE_DIR', dir: this.props.path });
    }


    loadTask = () => {
        this.props.dispatch({
            type: 'EXPLORER_ACTION_RETURN',
            action: 'loadTask'
        });
    }


    createTask = (task_type) => {
        this.props.dispatch({
            type: 'EXPLORER_ACTION_RETURN',
            action: 'createTask',
            task_type
        });
    }


    cloneTask = (path_src) => {
        this.props.dispatch({
            type: 'EXPLORER_ACTION_RETURN',
            action: 'cloneTask',
            path_src
        });
    }


    selectPathSrc = () => {
        this.props.dispatch({
            type: 'TASK_OPEN',
            path: this.props.path,
            path_dst: this.props.path,
            controls: {
                select_path: true
            }
        })
    }


    cancel = () => {
        this.props.dispatch({
            type: 'EXPLORER_ACTION_RETURN',
            action: 'close'
        });
    }


    render() {
        const is_current_task = this.props.task_path && this.props.task_path === this.props.path;
        const is_home = !this.props.path;
        const { flags, controls } = this.props;
        const task_create_available = !flags.is_task_subfolder && !flags.has_subfolders && !is_home;
        const title = controls.select_path ? 'Select task to clone' : 'Select task folder';
        return (
            <Modal show={this.props.visible} onHide={this.cancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { this.props.loading ? <Loader/> : <Breadcrumbs nav={this.nav} path={this.props.path}/>}
                    <List list={this.props.list} nav={this.nav} path={this.props.path}/>
                </Modal.Body>
                { !is_home && controls.create_dir && !this.props.loading &&
                    <Modal.Footer>
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
                { !this.props.loading &&
                    <Modal.Footer>
                        <ButtonToolbar className="pull-left">
                            <Button onClick={this.navRefresh}>Refresh</Button>
                            { !is_home && controls.remove_dir && !is_current_task &&
                                <Button bsStyle="danger" onClick={this.removeDir}>
                                    { flags.is_task ? 'Delete task' : 'Delete dir' }
                                </Button>
                            }
                        </ButtonToolbar>

                        <ButtonToolbar className="pull-right">
                            { flags.is_task && controls.load_task && !is_current_task &&
                                <Button onClick={this.loadTask} bsStyle="primary">Open task</Button>
                            }
                            { flags.is_task && controls.select_path &&
                                <Button onClick={()=>this.cloneTask(this.props.path)} bsStyle="primary">Clone this task</Button>
                            }
                            { task_create_available && controls.create_task &&
                                <DropdownButton bsStyle="default" title="Create task" noCaret dropup id="btn-create-task">
                                    { tasks_config.map(task =>
                                        <MenuItem key={task.type} onClick={()=>this.createTask(task.type)}>{task.title}</MenuItem>
                                    )}
                                </DropdownButton>
                            }
                            { task_create_available && controls.create_task &&
                                <DropdownButton bsStyle="default" title="Clone an existing task" noCaret dropup id="btn-clone-task">
                                    { this.props.path_src_history.map(path =>
                                        <MenuItem key={path} onClick={()=>this.cloneTask(path)}>{path}</MenuItem>
                                    )}
                                    { this.props.path_src_history.length > 0 &&
                                        <MenuItem divider />
                                    }
                                    <MenuItem onClick={this.selectPathSrc}>Choose source task ...</MenuItem>
                                </DropdownButton>
                            }
                            <Button onClick={this.cancel}>Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                }
            </Modal>
        );
    }

}

export default connect(
    state => state.explorer
)(Explorer);
