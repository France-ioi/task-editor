import React from 'react';
import { Button } from 'react-bootstrap';
import tasks_config from '../../../tasks/types/config.json';

class TaskCreate extends React.Component {

    render() {
        var { createTask } = this.props;
        return (
            <div className="task-create">
                <h3>Create new task</h3>
                {tasks_config.map(task =>
                    <Button key={task.type} onClick={() => createTask(task.type)}>{task.title}</Button>
                )}
            </div>
        );
    }

}

export default TaskCreate;

