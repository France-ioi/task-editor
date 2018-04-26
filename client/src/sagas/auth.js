import { call, put, takeEvery, select } from 'redux-saga/effects'
import api from '../api/auth'

function* login(action) {
    try {
        const { username, password } = action;
        const data = yield call(api.login, { username, password });
        yield put({type: 'AUTH_LOGIN_SUCCESS', username, token: data.token });
    } catch (e) {
        yield put({type: 'AUTH_FAIL', error: e.message});
    }
}

function* logout(action) {
    try {
        const { token } = yield select(state => state.auth)
        yield call(api.logout, { token });
        yield put({type: 'AUTH_LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({type: 'AUTH_FAIL', error: e.message});
    }
}

export default function* () {
    yield takeEvery('AUTH_LOGIN_REQUEST', login);
    yield takeEvery('AUTH_LOGOUT_REQUEST', logout);
}