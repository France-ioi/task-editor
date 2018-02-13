var default_state = {
    list: null,
    loading: false,
    error: null
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'FILES_FETCH_REQUEST':
            return {
                list: null,
                loading: true,
                error: null
            };

        case 'FILES_FETCH_SUCCESS':
            return {
                list: action.list,
                loading: false,
                error: null
            };

        case 'FILES_FETCH_FAIL':
            return {
                list: null,
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
};
