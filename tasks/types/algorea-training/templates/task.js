(function () {
    function initTask(subTask) {

        subTask.gridInfos;
        subTask.gridInfos.maxInstructions;
        subTask.gridInfos.includeBlocks;
        subTask.data;

        initBlocklySubTask(subTask);

        var thresholds;
        for (var i = 0; i < thresholds.length; i++) {
            displayHelper[thresholds[i].key] = thresholds[i].value;
        }
    }

    initWrapper(initTask, Object.keys(subTask.data), null, true);
})()
