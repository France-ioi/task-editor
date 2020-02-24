module.exports = function (data) {

    var levels = ['easy', 'medium', 'hard'];
    var res = {};

    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        if(data.difficulties[level].scenes.length) {
            res[level] = data.difficulties[level].scenes;
        }
    }

    return res;
}