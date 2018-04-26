import { call, put, takeEvery, select } from 'redux-saga/effects'
import api_task from '../api/task'
import api_importer from '../api/task_importer'
import { explorer } from './explorer'

function* open(action) {
    var { path, controls, path_dst } = action
    const res = yield call(explorer, {
        path,
        controls: controls || {}
    });


    switch(res.action) {
        case 'loadTask':
            yield put({
                type: 'TASK_FETCH_LOAD',
                path: res.path
            });
            break;
        case 'createTask':
            yield put({
                type: 'TASK_FETCH_CREATE',
                task_type: res.task_type,
                path: res.path
            });
            break;

        case 'cloneTask':
            if(!path_dst) {
                path_dst = yield select(state => state.explorer.path)
            }
            if(path_dst != res.path_src) {
                yield put({
                    type: 'TASK_FETCH_CLONE',
                    path: path_dst,
                    path_src: res.path_src
                });
            }
            break;
    }
}



function* create(action) {
    try {
        const { token } = yield select(state => state.auth)
        const params = {
            token,
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
        const { token } = yield select(state => state.auth)
        const params = {
            token,
            path: action.path
        }
        const { data, schema } = yield call(api_task.load, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


function* clone(action) {
    try {
        const { token } = yield select(state => state.auth)
        const task = yield select(state => state.task)
        const params = {
            token,
            path: action.path,
            path_src: action.path_src
        }
        const { data, schema } = yield call(api_task.clone, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


function* save(action) {
    try {
        const { token } = yield select(state => state.auth)
        const task = yield select(state => state.task)
        const params = {
            token,
            path: task.path,
            data: task.data
        }
        const data = yield call(api_task.save, params);
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}


function* saveView(action) {
    try {
        const { token } = yield select(state => state.auth)
        const task = yield select(state => state.task)
        var params = {
            token,
            path: task.path,
            data: task.data
        }
        yield call(api_task.save, params);

        var params = {
            token,
            path: task.path
        }
        const res = yield call(api_importer.checkoutSvn, params);
        if(!res || !res.success) {
            throw new Error('Task importer return: ' + (res.error || 'unknown error'));
        }
        yield put({type: 'TASK_FETCH_SUCCESS', url: res.tasks[0].normalUrl});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
    }
}




export default function* () {
    yield takeEvery('TASK_OPEN', open);
    yield takeEvery('TASK_FETCH_LOAD', load);
    yield takeEvery('TASK_FETCH_SAVE', save);
    yield takeEvery('TASK_FETCH_CLONE', clone);
    yield takeEvery('TASK_FETCH_SAVE_VIEW', saveView);
    yield takeEvery('TASK_FETCH_CREATE', create);
}