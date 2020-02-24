(function () {
    var subTaskData;
    var checkEndCondition;

    function initTask(subTask) {
        subTask.gridInfos;
        subTask.gridInfos.maxInstructions;
        subTask.gridInfos.includeBlocks;

        if(checkEndCondition) {
            subTask.gridInfos.checkEndCondition = robotEndConditions[checkEndCondition];
        }

        subTask.data = subTaskData;

        initBlocklySubTask(subTask);

        var thresholds;
        for (var i = 0; i < thresholds.length; i++) {
            displayHelper[thresholds[i].key] = thresholds[i].value;
        }
    }

    initWrapper(initTask, Object.keys(subTaskData), null, true);
})()
