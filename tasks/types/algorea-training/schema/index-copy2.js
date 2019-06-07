module.exports = {
    title: 'Task',
    type: 'object',
    description: 'This editor allows you to edit the various aspects of a task. All the data in this editor is organized as a JSON object, whose properties represent each task part. Some properties are optional, and are hidden by default in the editor; to display them, click "Object properties" on each tree item to add these optional properties.',
    properties: {
        context: {
            type: 'string',
            enum: ['none', 'arrows', 'cards', 'gems', 'chticode_abs', 'chticode_rel', 'cones', 'course', 'dominoes', 'marbles', 'objects_in_space', 'paint', 'rocket', 'sokoban', 'new']
        },
        scene: {
            type: 'grid',
            watch: {
                sceneContext: 'root.context'
            }
        }
    },
    required: ['context', 'scene']
};