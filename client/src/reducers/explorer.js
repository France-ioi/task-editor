var default_state = {
    path: null,
    list: null,
    loading: false,
    error: null
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'EXPLORER_FETCH_READDIR':
            return {
                path: action.path,
                list: null,
                loading: true,
                error: null
            };

        case 'EXPLORER_FETCH_SUCCESS':
            return {
                ...state,
                list: action.list,
                loading: false,
                error: null
            };

        case 'EXPLORER_FETCH_FAIL':
            return {
                ...state,
                list: null,
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
};
