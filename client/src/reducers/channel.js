var default_state = null;

export default (state = default_state, action) => {
    switch(action.type) {
        case 'CHANNEL_SET':
            return action.channel;

        default:
            return state;
    }
};