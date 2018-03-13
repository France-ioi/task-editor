import { call, put, takeEvery, select } from 'redux-saga/effects'
import api_task from '../api/task'


function* create(action) {
    try {
        const params = {
            path: action.path,
            task_type: action.task_type
        }
        const { schema, data } = yield call(api_task.create, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


function* load(action) {
    try {
        const params = {
            path: action.path
        }
        // may be get path from explorer state?
        const { data, schema } = yield call(api_task.load, params);

        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


function* save(action) {
    try {
        const task = yield select(state => state.task)
        const params = {
            path: task.path,
            data: task.data
        }
        const data = yield call(api_task.save, params);
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


export default function* () {
    yield takeEvery('TASK_FETCH_LOAD', load);
    yield takeEvery('TASK_FETCH_SAVE', save);
    yield takeEvery('TASK_FETCH_CREATE', create);
}