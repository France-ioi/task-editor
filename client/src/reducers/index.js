import { combineReducers } from 'redux';

import task from './task';
import files from './files';
import explorer from './explorer';
import svn from './svn';

const reducers = combineReducers({
    task,
    files,
    explorer,
    svn
});

export default reducers;