module.exports = function (data) {

    var default_value = 5000;

    var levels = ['easy', 'medium', 'hard'];
    var res = []
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        if(data.difficulties[level].scenes.length) {
            res.push({
                key: 'threshold' + level.charAt(0).toUpperCase() + level.slice(1),
                value: parseInt(data.difficulties[level].displayHelperThreshold, 10) || default_value
            });
        }
    }
    return res;
};