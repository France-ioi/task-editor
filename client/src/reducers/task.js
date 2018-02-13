var default_state = {
    path: null,
    data: null,
    loading: false,
    ready: false,
    error: null
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'TASK_FETCH_LOAD':
            return {
                ...state,
                path: action.path,
                data: null,
                loading: true,
                ready: false,
                error: null
            };

        case 'TASK_FETCH_SAVE':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'TASK_SET_DATA':
            return {
                ...state,
                data: action.data
            };

        case 'TASK_FETCH_SUCCESS':
            return {
                ...state,
                ready: true,
                loading: false
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
