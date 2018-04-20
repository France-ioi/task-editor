import { put, take } from 'redux-saga/effects'


function* confirmation(message) {
    yield put({type: 'CONFIRMATION_SHOW', message });
    const { type } = yield take([
        'CONFIRMATION_YES',
        'CONFIRMATION_NO'
    ]);
    yield put({type: 'CONFIRMATION_HIDE' });
    return type == 'CONFIRMATION_YES';
}

export default confirmation;