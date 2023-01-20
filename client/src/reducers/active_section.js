var default_state = 'json';

export default (state = default_state, action) => {
    switch(action.type) {
        case 'TASK_FETCH_CREATE_START':
            return 'create';

        case 'LAYOUT_CHANGE_SECTION':
            return action.active_section;

        default:
            return state;
    }
};
