var default_state = {
    path: null,
    data: null,
    schema: {},
    loading: false,
    ready: false,
    error: null,
    url: null
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'TASK_FETCH_CREATE':
        case 'TASK_FETCH_LOAD':
            return {
                ...state,
                path: action.path,
                data: null,
                schema: {},
                loading: true,
                ready: false,
                error: null,
                url: null
            };

        case 'TASK_FETCH_SAVE':
        case 'TASK_FETCH_SAVE_VIEW':
            return {
                ...state,
                loading: true,
                error: null,
                url: null
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
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
};
