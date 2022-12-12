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
import TaskViewer from './task_viewer';
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
        this.props.dispatch({
            type: 'TASK_FETCH_LOAD',
            path: ''
        });
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


    taskDataChange = (data, translations) => {
        this.props.dispatch({type: 'TASK_SET_DATA', data})
        this.props.dispatch({type: 'TASK_SET_TRANSLATIONS', translations})
    }


    showSection = (active_section) => {
/*        this.setState({
            ...this.state,
            active_section
        });*/
        this.props.dispatch({type: 'LAYOUT_CHANGE_SECTION', active_section});
    }


    render() {
        const { task, active_section } = this.props;
//        const { active_section } = this.state;

        const sectionVisible = (name) => task.ready && active_section == name;

        return (
            <div>
                { task.loading && <Loader modal/>}
                {/* <ControlPanel task={task}
                    openTask={this.openTask} saveTask={this.saveTask}
                    active_section={active_section} showSection={this.showSection}
                /> */}
                <div className="editor-container">
                    {!task.ready && <Alert bsStyle="info">Loading...</Alert>}
                    { sectionVisible('json') && <TaskJsonEditor task={task} onChange={this.taskDataChange}/>}
                    { sectionVisible('svn') && <TaskSvn path={task.path}/>}
                    { sectionVisible('import') && <TaskImporter path={task.path} token="TODO"/>}
                    { sectionVisible('files_manager') && <FilesManager task_path={task.path}/>}
                    { sectionVisible('view_task') && <TaskViewer task_path={task.path}/>}
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
