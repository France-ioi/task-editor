import { call, put, takeEvery, select } from 'redux-saga/effects'
import explorer from '../api/explorer'


function* readDir(action) {
    try {
        const { token } = yield select(state => state.auth)
        const params = {
            token,
            path: action.path
        }
        const data = yield call(explorer.readDir, params);
        yield put({type: 'FILES_MANAGER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'FILES_MANAGER_FETCH_FAIL', error: e.message});
    }
}


function* remove(action) {
    try {
        const { token } = yield select(state => state.auth)
        const { path } = yield select(state => state.files_manager)
        const params = {
            token,
            path: path + '/' + action.name
        }
        const data = yield call(explorer.remove, params);
        yield put({type: 'FILES_MANAGER_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'FILES_MANAGER_FETCH_FAIL', error: e.message});
    }
}


export default function* () {
    yield takeEvery('FILES_MANAGER_FETCH_READ_DIR', readDir);
    yield takeEvery('FILES_MANAGER_FETCH_REMOVE', remove);
}