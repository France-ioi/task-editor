import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import ControlPanel from './control_panel';
import Explorer from './explorer';
import Loader from './ui/loader';

import TaskJsonEditor from './task_json_editor';
import TaskSvn from './task_svn';
import TaskImporter from './task_importer';
import FilesManager from './files_manager';


class Layout extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            explorer_visible: false,
            active_section: 'json'
        };
    }

    componentDidMount() {
        //used for dev purpose
        if(window.__CONFIG__.dev.task_autoload) {
            this.props.dispatch({
                type: 'TASK_FETCH_LOAD',
                path: window.__CONFIG__.dev.task_autoload
            })
        }
    }


    toggleExplorer = () => {
        this.setState({
            ...this.state,
            explorer_visible: !this.state.explorer_visible
        })
    }

    createTask = (path, task_type) => {
        this.props.dispatch({type: 'TASK_FETCH_CREATE', path, task_type })
    }


    loadTask = (path) => {
        this.props.dispatch({type: 'TASK_FETCH_LOAD', path })
    }


    saveTask = (mode) => {
        if(mode == 'view') {
            this.props.dispatch({type: 'TASK_FETCH_SAVE_VIEW'})
        } else {
            this.props.dispatch({type: 'TASK_FETCH_SAVE'})
        }
    }


    taskDataChange = (data) => {
        this.props.dispatch({type: 'TASK_SET_DATA', data})
    }


    showSection = (active_section) => {
        this.setState({
            ...this.state,
            active_section
        });
    }


    render() {
        const { task, auth } = this.props;
        const { explorer_visible, active_section } = this.state;

        const sectionVisible = (name) => task.ready && active_section == name;

        return (
            <div>
                { task.loading && <Loader modal/>}
                <ControlPanel task={task}
                    toggleExplorer={this.toggleExplorer} saveTask={this.saveTask}
                    active_section={active_section} showSection={this.showSection}
                    username={auth.username}
                />
                <div className="editor-container">
                    { task.error && <Alert bsStyle="danger">{task.error}</Alert>}
                    { !task.ready && <Alert bsStyle="info">Click open to load task</Alert>}
                    { sectionVisible('json') && <TaskJsonEditor task={task} onChange={this.taskDataChange}/>}
                    { sectionVisible('svn') && <TaskSvn path={task.path}/>}
                    { sectionVisible('import') && <TaskImporter path={task.path} token={auth.token}/>}
                    { sectionVisible('files_manager') && <FilesManager task_path={task.path}/>}
                </div>
                <Explorer visible={explorer_visible} toggle={this.toggleExplorer}
                    loadTask={this.loadTask} createTask={this.createTask}/>
            </div>
        )
    }

}

export default connect(
    state => state
)(Layout);