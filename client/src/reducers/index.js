import { combineReducers } from 'redux';

import task from './task';
import files from './files';
import explorer from './explorer';
import svn from './svn';
import files_manager from './files_manager'

const reducers = combineReducers({
    task,
    files,
    explorer,
    svn,
    files_manager
});

export default reducers;