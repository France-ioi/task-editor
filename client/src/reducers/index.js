import { combineReducers } from 'redux';

import active_section from './active_section'
import channel from './channel'
import task from './task';
import task_importer from './task_importer';
import explorer from './explorer';
import svn from './svn';
import files_manager from './files_manager'
import confirmation from './confirmation'
import alert_popup from './alert_popup'

const reducers = combineReducers({
    active_section,
    channel,
    task,
    task_importer,
    explorer,
    svn,
    files_manager,
    confirmation,
    alert_popup
});

export default reducers;
