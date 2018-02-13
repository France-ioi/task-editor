import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import ControlPanel from './control_panel';
import Explorer from './explorer';
import { Loader } from './ui'

import TaskJsonEditor from './task_json_editor';
import TaskFilesManager from './task_files_manager';
import TaskSvn from './task_svn';

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
        //this.props.dispatch({type: 'TASK_FETCH_LOAD', path: window.__CONFIG__.path })
    }


    toggleExplorer = () => {
        this.setState({
            ...this.state,
            explorer_visible: !this.state.explorer_visible
        })
    }


    loadTask = (path) => {
        this.props.dispatch({type: 'TASK_FETCH_LOAD', path })
    }


    saveTask = () => {
        this.props.dispatch({type: 'TASK_FETCH_SAVE'})
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
        const { task } = this.props;
        const { explorer_visible, active_section } = this.state;

        const sectionVisible = (name) => task.ready && active_section == name;

        return (
            <div>
                { task.loading && <Loader modal/>}
                <ControlPanel task={task}
                    toggleExplorer={this.toggleExplorer} saveTask={this.saveTask}
                    active_section={active_section} showSection={this.showSection}
                    />
                <div className="editor-container">
                    { !task.ready && <Alert bsStyle="info">Click open to load task</Alert>}
                    { sectionVisible('json') && <TaskJsonEditor task={task} onChange={this.taskDataChange}/>}
                    { sectionVisible('files') && <TaskFilesManager path={task.path}/>}
                    { sectionVisible('svn') && <TaskSvn path={task.path}/>}
                </div>
                <Explorer visible={explorer_visible} toggle={this.toggleExplorer} loadTask={this.loadTask}/>
            </div>
        )
    }

}

export default connect(
    state => state
)(Layout);