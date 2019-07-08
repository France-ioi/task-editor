(function () {
    function initTask(subTask) {

        subTask.gridInfos;

        subTask.gridInfos.maxInstructions;

        subTask.data;

        initBlocklySubTask(subTask);

        var thresholds;
        for (var i = 0; i < thresholds.length; i++) {
            displayHelper[thresholds[i].key] = thresholds[i].value;
        }
    }

    var levels;
    initWrapper(initTask, levels, null, true);
})()
