var default_state = {
    path: null,
    data: null,
    schema: {},
    loading: false,
    ready: false,
    url: null,
    lastUrl: null
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'TASK_FETCH_CREATE':
        case 'TASK_FETCH_LOAD':
        case 'TASK_FETCH_CLONE':
            return {
                ...state,
                path: action.path,
                data: null,
                schema: {},
                loading: true,
                ready: false,
                url: null
            };

        case 'TASK_FETCH_CREATE_START':
            return {
                ...state,
                loading: false,
                ready: true
            }

        case 'TASK_FETCH_SAVE':
        case 'TASK_FETCH_SAVE_VIEW':
            return {
                ...state,
                loading: true,
                url: null
            };

        case 'TASK_GOT_URL':
            return {
                ...state,
                url: action.testUrl,
                lastUrl: action.testUrl
            };

        case 'TASK_SET_DATA':
            return {
                ...state,
                data: action.data
            };

        case 'TASK_SET_SCHEMA':
            return {
                ...state,
                schema: action.schema
            };

        case 'TASK_SET_TRANSLATIONS':
            return {
                ...state,
                translations: action.translations
            };

        case 'TASK_SET_VERSION':
            return {
                ...state,
                version: action.version
            };

        case 'TASK_FETCH_SUCCESS':
            return {
                ...state,
                ready: true,
                loading: false,
                url: action.url || null
            };

        case 'TASK_FETCH_FAIL':
            return {
                ...state,
                loading: false
            };

        case 'TASK_CLOSE':
            return state.path == action.path ? default_state : state;

        default:
            return state;
    }
};
