import { call, put, takeEvery } from 'redux-saga/effects'
import api from '../api/auth'

function* login(action) {
    try {
        const { username, password, svn_update } = action;
        const data = yield call(api.login, { username, password, svn_update });
        yield put({type: 'AUTH_LOGIN_SUCCESS', username, token: data.token });
    } catch (e) {
        yield put({type: 'AUTH_LOGIN_FAIL', error: e.message});
    }
}

export default function* () {
    yield takeEvery('AUTH_LOGIN_REQUEST', login);
}