var default_state = {
    path: null,
    data: null,
    schema: {},
    loading: false,
    ready: false,
    url: null
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

        case 'TASK_FETCH_SAVE':
        case 'TASK_FETCH_SAVE_VIEW':
            return {
                ...state,
                loading: true,
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
                loading: false
            };

        default:
            return state;
    }
};
