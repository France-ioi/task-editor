module.exports = function (data) {

    var levels = ['easy', 'medium', 'hard'];
    var res = {};

    for (var i = 0; i < data.difficulties.length; i++) {
        if (i >= levels.length) continue;
        res[levels[i]] = [
            {
                tiles: data.difficulties[i].scene.tiles,
                initItems: data.difficulties[i].scene.initItems
            }
        ];
    }

    return res;
}