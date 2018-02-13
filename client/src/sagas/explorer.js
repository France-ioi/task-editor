import { call, put, takeEvery } from 'redux-saga/effects'
import explorer from '../api/explorer'


function* fetchDir(action) {
    try {
        const params = {
            path: action.path,
            folders: true,
            files: false
        }
        const list = yield call(explorer.readDir, params);
        yield put({type: 'EXPLORER_FETCH_SUCCESS', list });
    } catch (e) {
        yield put({type: 'EXPLORER_FETCH_FAIL', error: e.message});
    }
}

export default function* () {
    yield takeEvery('EXPLORER_FETCH_READDIR', fetchDir);
}