const default_state = {
    test: {
        loading: false,
        data: null,
        error: false
    }
};

export default (state = default_state, action) => {
    switch(action.type) {
        case 'TEST_FETCH_REQUESTED':
            return {
                ...state,
                test: {
                    ...state.test,
                    loading: true,
                    error: false
                }
            };

        case 'TEST_FETCH_SUCCEEDED':
            return {
                ...state,
                test: {
                    ...state.test,
                    data: action.data,
                    loading: false
                }
            };

        case 'TEST_FETCH_FAILED':
            return {
                ...state,
                test: {
                    loading: false,
                    data: null,
                    error: action.error
                }
            };

        default:
            return state;
    }
};