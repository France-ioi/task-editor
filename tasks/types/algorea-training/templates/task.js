(function () {
    var subTaskData;
    var checkEndCondition;

    function initTask(subTask) {
        subTask.gridInfos;
        subTask.gridInfos.maxInstructions;
        subTask.gridInfos.variables;
        subTask.gridInfos.includeBlocks;

        if(checkEndCondition) {
            subTask.gridInfos.checkEndCondition = robotEndConditions[checkEndCondition];
        }

        subTask.data = subTaskData;

        initBlocklySubTask(subTask);

        displayHelper.thresholdEasy;
        displayHelper.thresholdMedium;
    }

    initWrapper(initTask, Object.keys(subTaskData), null, true);
})()
