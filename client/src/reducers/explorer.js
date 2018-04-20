var default_state = {
    visible: false,
    path: '',
    controls: {},
    list: null,
    flags: {},
    loading: false,
    error: null,
    path_src_history: []
}


function refreshPathSrcHistory(history, path) {
    let new_history = history.filter((item) => {
        return item != path;
    });
    new_history.push(path);
    if(new_history.length > 10) {
        new_history = new_history.slice(1)
    }
    return new_history;
}


export default (state = default_state, action) => {

    switch(action.type) {
        case 'EXPLORER_SHOW':
            return {
                ...state,
                path: action.path,
                controls: action.controls,
                visible: true
            }
            break;

        case 'EXPLORER_HIDE':
            return {
                ...state,
                visible: false
            }
            break;

        case 'EXPLORER_ACTION_RETURN':
            if(action.path_src) {
                return {
                    ...state,
                    path_src_history: refreshPathSrcHistory(state.path_src_history, action.path_src)
                }
            }
            return state;
            break;

        case 'EXPLORER_FETCH_READ_DIR':
        case 'EXPLORER_FETCH_CREATE_DIR':
        case 'EXPLORER_FETCH_REMOVE_DIR':
            return {
                ...state,
                list: null,
                loading: true,
                error: null
            };

        case 'EXPLORER_FETCH_SUCCESS':
            return {
                ...state,
                path: action.data.path,
                list: action.data.list,
                flags: action.data.flags,
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
