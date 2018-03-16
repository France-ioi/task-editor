var default_state = {
    path: null,
    list: null,
    loading: false,
    error: null
}

export default (state = default_state, action) => {

    switch(action.type) {
        case 'FILES_MANAGER_FETCH_READ_DIR':
        case 'FILES_MANAGER_FETCH_REMOVE':
            return {
                ...state,
                list: null,
                loading: true,
                error: null
            };

        case 'FILES_MANAGER_FETCH_SUCCESS':
            return {
                ...state,
                path: action.data.path,
                list: action.data.list,
                loading: false,
                error: null
            };

        case 'FILES_MANAGER_FETCH_FAIL':
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
