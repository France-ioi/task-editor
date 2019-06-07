module.exports = function (data) {

    var levels = ['basic', 'easy', 'medium', 'hard'];
    return levels.slice(0, data.difficulties.length);

}