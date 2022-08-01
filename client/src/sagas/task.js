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
                creating: action.creating,
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
        const params = {
            path: action.path,
            task_type: action.task_type
        }
        const { schema, data, translations, version } = yield call(api_task.create, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_SET_TRANSLATIONS', translations});
        yield put({type: 'TASK_SET_VERSION', version});
        yield put({type: 'TASK_FETCH_SUCCESS'});
        if(action.creating) {
            yield put({type: 'TASK_FETCH_SAVE_VIEW'});
        }
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* load(action) {
    try {
        const params = {
            path: action.path
        }
        const { data, schema, translations, version } = yield call(api_task.load, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_SET_TRANSLATIONS', translations});
        yield put({type: 'TASK_SET_VERSION', version});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* clone(action) {
    try {
        const task = yield select(state => state.task)
        const params = {
            path: action.path,
            path_src: action.path_src
        }
        const { data, schema, translations, version } = yield call(api_task.clone, params);
        yield put({type: 'TASK_SET_SCHEMA', schema});
        yield put({type: 'TASK_SET_DATA', data});
        yield put({type: 'TASK_SET_TRANSLATIONS', translations});
        yield put({type: 'TASK_SET_VERSION', version});
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* save(action) {
    try {
        const task = yield select(state => state.task)
        const params = {
            path: task.path,
            data: task.data,
            translations: task.translations,
            version: task.version
        }
        const data = yield call(api_task.save, params);
        yield put({type: 'TASK_FETCH_SUCCESS'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message });
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* saveView(action) {
    try {
        const task = yield select(state => state.task)
        const params = {
            path: task.path,
            data: task.data,
            translations: task.translations
        }
        yield call(api_task.save, params);
        yield put({type: 'TASK_FETCH_SUCCESS'});
        yield put({type: 'LAYOUT_CHANGE_SECTION', active_section: 'import'});
    } catch (e) {
        yield put({type: 'TASK_FETCH_FAIL', error: e.message});
        yield put({type: 'ALERT_SHOW', message: e.message });
    }
}


function* fetchSuccess() {
    const path = yield select(state => state.task.path);
    window.location.hash = '#edit/' + encodeURIComponent(path);
}


function* gotUrl(action) {
    try {
        const channel = yield select(state => state.channel);
        channel.notify({method: 'link', params: {
            url: action.url,
            ltiUrl: action.ltiUrl,
            testUrl: action.testUrl
            }});
    } catch(e) {
        console.log(e);
    }
}


function* importerGetUrl(action) {
    try {
        const params = {
            path: action.path
        }
        const { url } = yield call(api_importer.getUrl, params);
        yield put({type: 'IMPORTER_GOT_URL', url});
    } catch(e) {
        console.log(e);
    }
}


export default function* () {
    yield takeEvery('TASK_OPEN', open);
    yield takeEvery('TASK_FETCH_LOAD', load);
    yield takeEvery('TASK_FETCH_SAVE', save);
    yield takeEvery('TASK_FETCH_CLONE', clone);
    yield takeEvery('TASK_FETCH_SAVE_VIEW', saveView);
    yield takeEvery('TASK_FETCH_CREATE', create);
    yield takeEvery('TASK_FETCH_SUCCESS', fetchSuccess);
    yield takeEvery('TASK_GOT_URL', gotUrl);
    yield takeEvery('IMPORTER_GET_URL', importerGetUrl);
}
