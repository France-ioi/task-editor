module.exports = function (data) {

    var default_value = 5000;

    var levels = ['basic', 'easy', 'medium', 'hard'];
    var res = []
    for (var i = 0; i < data.difficulties.length; i++) {
        if (i >= levels.length) continue;
        var level = levels[i];
        res.push({
            key: 'threshold' + level.charAt(0).toUpperCase() + level.slice(1),
            value: parseInt(data.difficulties[i].displayHelperThreshold, 10) || default_value
        });
    }
    return res;
};