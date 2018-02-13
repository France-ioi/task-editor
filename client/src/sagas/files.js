import { call, put, takeEvery } from 'redux-saga/effects'
import api from '../api/files'

function* fetchTask(action) {
    try {
        const data = yield call(api.load, action.payload);
        yield put({type: 'FILES_FETCH_SUCCESS', data });
    } catch (e) {
        yield put({type: 'FILES_FETCH_FAIL', error: e.message});
    }
}

export default function* () {
    yield takeEvery('FILES_FETCH_REQUEST', fetchTask);
}