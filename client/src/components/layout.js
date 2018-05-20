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
import Confirmation from './confirmation';
import AlertPopup from './alert_popup';

class Layout extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
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

        // Check for URL elements
        if(window.location.hash) {
            var hashSplit = window.location.hash.split('/');
            var hashCmd = hashSplit.shift();
            var hashPath = hashSplit.join('/');
            if(hashCmd == '#create' && hashPath) {
                // Create a new task
                this.props.dispatch({
                    type: 'TASK_OPEN',
                    path: hashPath,
                    creating: true,
                    controls: {
                        load_task: true, // TODO :: yes or no?
                        create_task: true,
                        create_dir: true,
                        remove_dir: true
                    }
                });
            } else if(hashCmd == '#edit' && hashPath) {
                this.props.dispatch({
                    type: 'TASK_FETCH_LOAD',
                    path: hashPath
                });
            }
        }
    }


    logout = () => {
        this.props.dispatch({ type: 'AUTH_LOGOUT_REQUEST'});
    }


    openTask = () => {
        this.props.dispatch({
            type: 'TASK_OPEN',
            path: this.props.task.ready ? this.props.task.path : '',
            controls: {
                load_task: true,
                create_task: true,
                create_dir: true,
                remove_dir: true
            }
        })
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
/*        this.setState({
            ...this.state,
            active_section
        });*/
        this.props.dispatch({type: 'LAYOUT_CHANGE_SECTION', active_section});
    }


    render() {
        const { task, auth, active_section } = this.props;
//        const { active_section } = this.state;

        const sectionVisible = (name) => task.ready && active_section == name;

        return (
            <div>
                { task.loading && <Loader modal/>}
                <ControlPanel task={task}
                    openTask={this.openTask} saveTask={this.saveTask}
                    logout={this.logout}
                    active_section={active_section} showSection={this.showSection}
                    username={auth.username}
                />
                <div className="editor-container">
                    { !task.ready && <Alert bsStyle="info">Click open to load task</Alert>}
                    { sectionVisible('json') && <TaskJsonEditor task={task} onChange={this.taskDataChange}/>}
                    { sectionVisible('svn') && <TaskSvn path={task.path}/>}
                    { sectionVisible('import') && <TaskImporter path={task.path} token={auth.token}/>}
                    { sectionVisible('files_manager') && <FilesManager task_path={task.path}/>}
                </div>
                <Explorer task_path={this.props.task.path}/>
                <Confirmation/>
                <AlertPopup/>
            </div>
        )
    }

}

export default connect(
    state => state
)(Layout);
