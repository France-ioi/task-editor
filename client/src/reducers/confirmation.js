var default_state = {
    visible: false,
    message: 'Confirm action'
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'CONFIRMATION_SHOW':
            return {
                ...state,
                visible: true,
                message: action.message
            };

        case 'CONFIRMATION_HIDE':
            return {
                ...state,
                visible: false
            };

        default:
            return state;
    }
};
