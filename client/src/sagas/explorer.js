import { call, put, takeEvery, select } from 'redux-saga/effects'
import explorer from '../api/explorer'
import confirmation from './confirmation'

function* readDir(action) {
    try {
        const { token } = yield select(state => state.auth)
        const params = {
            token,
            path: action.path
        }
        const data = yield call(explorer.readDir, params);
        yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
    }
}


function* createDir(action) {
    try {
        const { token } = yield select(state => state.auth)
        const { path } = yield select(state => state.explorer)
        const params = {
            token,
            dir: action.dir,
            path
        }
        const data = yield call(explorer.createDir, params);
        yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
    }
}


function* removeDir(action) {
    try {
        const confirmed = yield call(confirmation, 'Remove dir?');
        if(confirmed) {
            yield put({type: 'EXPLORER_FETCH_REMOVE_DIR', data });
            const { token } = yield select(state => state.auth)
            const { path } = yield select(state => state.explorer)
            const params = {
                token,
                path
            }
            const data = yield call(explorer.remove, params);
            yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
        }
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
    }
}


export default function* () {
    yield takeEvery('EXPLORER_FETCH_READ_DIR', readDir);
    yield takeEvery('EXPLORER_FETCH_CREATE_DIR', createDir);
    yield takeEvery('EXPLORER_REMOVE_DIR', removeDir);

}