import { call, put, takeEvery } from 'redux-saga/effects'
import api from '../api/svn'

function* fetchSvn(action) {
    try {
        const { path, cmd, message } = action;
        const data = yield call(api[action.cmd], { path, cmd, message });
        yield put({type: 'SVN_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'SVN_FETCH_FAIL', error: e.message});
    }
}

export default function* () {
    yield takeEvery('SVN_FETCH', fetchSvn);
}