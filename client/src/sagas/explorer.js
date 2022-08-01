import { call, put, take, takeEvery, select } from 'redux-saga/effects'
import api from '../api/explorer'
import confirmation from './confirmation'

function* readDir(action) {
    try {
        const params = {
            path: action.path,
            refresh: action.refresh
        }
        const data = yield call(api.readDir, params);
        yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* createDir(action) {
    try {
        const { path } = yield select(state => state.explorer)
        const params = {
            dir: action.dir,
            path
        }
        const data = yield call(api.createDir, params);
        yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* removeDir(action) {
    const title = "Remove dir '" + action.dir + "'?";
    const confirmed = yield call(confirmation, title);
    if(confirmed) {
        try {
            yield put({type: 'EXPLORER_FETCH_REMOVE_DIR', data });
            const params = {
                path: action.dir
            }
            const data = yield call(api.remove, params);
            yield put({type: 'TASK_CLOSE', path: action.dir });
            yield put({type: 'EXPLORER_FETCH_SUCCESS', data });
        } catch (e) {
            yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
            yield put({type: 'ALERT_SHOW', message: e.message });
        }
    }
}


export function* explorer(params) {
    yield put({type: 'EXPLORER_SHOW', ...params });
    yield readDir(params);
    const res = yield take('EXPLORER_ACTION_RETURN');
    const { path, creating } = yield select(state => state.explorer)
    yield put({type: 'EXPLORER_HIDE' });
    return { path, creating, ...res };
}


export default function* () {
    yield takeEvery('EXPLORER_FETCH_READ_DIR', readDir);
    yield takeEvery('EXPLORER_FETCH_CREATE_DIR', createDir);
    yield takeEvery('EXPLORER_REMOVE_DIR', removeDir);
}
