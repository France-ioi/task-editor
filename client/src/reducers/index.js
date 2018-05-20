import { combineReducers } from 'redux';

import active_section from './active_section'
import auth from './auth'
import channel from './channel'
import task from './task';
import explorer from './explorer';
import svn from './svn';
import files_manager from './files_manager'
import confirmation from './confirmation'
import alert_popup from './alert_popup'

const reducers = combineReducers({
    active_section,
    auth,
    channel,
    task,
    explorer,
    svn,
    files_manager,
    confirmation,
    alert_popup
});

export default reducers;
