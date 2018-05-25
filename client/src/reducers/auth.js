import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants"; // what is this?

import storage from '../libs/auth_storage';
var data = storage.get();


const default_state = {
    loading: false,
    username: data ? data.username : null,
    token: data ? data.token : null,
    error: null
};

export default (state = default_state, action) => {
    switch(action.type) {
        case 'AUTH_LOGIN_REQUEST':
            return {
                loading: true,
                username: null,
                token: null,
                error: null
            };

        case 'AUTH_LOGIN_SUCCESS':
            storage.set({
                username: action.username,
                token: action.token,
            });
            return {
                loading: false,
                username: action.username,
                token: action.token,
                error: null
            };

        case 'AUTH_LOGOUT_REQUEST':
            return {
                ...state,
                loading: true
            };

        case 'AUTH_LOGOUT_SUCCESS':
            storage.clear();
            return {
                loading: false,
                username: null,
                token: null,
                error: null
            };

        case 'AUTH_FAIL':
            return {
                loading: false,
                username: null,
                token: null,
                error: action.error
            };

        default:
            return state;
    }
};