import { fork } from 'redux-saga/effects'

import auth from './auth';
import task from './task';
import explorer from './explorer';
import svn from './svn';
import files_manager from './files_manager';


export default function* () {
    yield [
        fork(auth),
        fork(task),
        fork(explorer),
        fork(svn),
        fork(files_manager)
    ]
}