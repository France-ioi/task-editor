var default_state = {
    data: null,
    error: null,
    loading: false
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'SVN_FETCH':
            return {
                ...state,
                loading: true,
                out: null,
                error: null
            };

        case 'SVN_FETCH_SUCCESS':
            return {
                ...state,
                data: action.data,
                error: null,
                loading: false
            };

        case 'SVN_FETCH_FAIL':
            return {
                ...state,
                data: null,
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
};
