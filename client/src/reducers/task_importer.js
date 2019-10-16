var default_state = {
    loading: true,
    url: ''
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'IMPORTER_GOT_URL':
            return {
                ...state,
                url: action.url,
                loading: false
            };

        default:
            return state;
    }
};
