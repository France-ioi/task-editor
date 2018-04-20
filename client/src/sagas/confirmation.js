import { put, take } from 'redux-saga/effects'


function* confirmation(message) {
    yield put({type: 'CONFIRMATION_SHOW', message });
    const { result } = yield take([
        'CONFIRMATION_YES',
        'CONFIRMATION_NO'
    ]);
    yield put({type: 'CONFIRMATION_HIDE' });
    return result == 'CONFIRMATION_YES';
}

export default confirmation;