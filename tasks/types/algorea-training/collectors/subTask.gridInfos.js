module.exports = function (data) {

    var keys = [
        'contextType',
        'conceptViewer',
        'showLabels',
        'bagInit',
        'languageStrings',
        'actionDelay',
        'checkEndEveryTurn',
        'ignoreInvalidMoves',
        'maxIterWithoutAction',
        'hideSaveOrLoad',
        'variables',
    ]

    for(var res = {}, key, i=0; i<keys.length; i++) {
        key = keys[i];
        if(key in data.gridInfos) {
            res[key] = data.gridInfos[key];
        }
    }

    return res;
}