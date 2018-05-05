var default_state = {
    visible: false,
    style: false,
    title: false,
    message: ''
}

export default (state = default_state, action) => {
    switch(action.type) {
        case 'ALERT_SHOW':
            return {
                ...state,
                visible: true,
                title: action.title,
                style: action.style,
                message: action.message
            };

        case 'ALERT_HIDE':
            return {
                ...state,
                visible: false
            };

        default:
            return state;
    }
};
