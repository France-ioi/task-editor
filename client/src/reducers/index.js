import { combineReducers } from 'redux';

import task from './task';
import files from './files';
import explorer from './explorer';

const reducers = combineReducers({
    task,
    files,
    explorer
});

export default reducers;