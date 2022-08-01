import { call, put, takeEvery, select } from 'redux-saga/effects'
import explorer from '../api/explorer'


function* readDir(action) {
    try {
        const params = {
            path: action.path
        }
        const data = yield call(explorer.readDir, params);
        yield put({type: 'FILES_MANAGER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'FILES_MANAGER_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* remove(action) {
    try {
        const { path } = yield select(state => state.files_manager)
        const params = {
            path: path + '/' + action.name
        }
        const data = yield call(explorer.remove, params);
        yield put({type: 'FILES_MANAGER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'FILES_MANAGER_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


export default function* () {
    yield takeEvery('FILES_MANAGER_FETCH_READ_DIR', readDir);
    yield takeEvery('FILES_MANAGER_FETCH_REMOVE', remove);
}