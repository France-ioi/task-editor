/*
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
fork
import api from '../api/test'


function* fetchTest(action) {
    try {
        const data = yield call(api.test, action.payload);
        yield put({type: "TEST_FETCH_SUCCEEDED", data });
    } catch (e) {
        yield put({type: "TEST_FETCH_FAILED", error: e.message});
    }
}

function* mySaga() {
    yield takeEvery("TEST_FETCH_REQUESTED", fetchTest);
}


function* mySaga() {
    yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}


export default mySaga;
*/

import { fork } from 'redux-saga/effects'


import task from './task';
import files from './files';
import explorer from './explorer';

/*
function startSagas(...sagas) {
    return function* rootSaga() {
        yield sagas.map(saga => fork(saga));
    }
}

const sagas = startSagas(task, files);
*/

export default function* () {
    yield [
        fork(task),
        fork(files),
        fork(explorer)
    ]
}