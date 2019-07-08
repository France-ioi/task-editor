module.exports = function (data) {

    var context_key = 'robot';
    var levels = ['basic', 'easy', 'medium', 'hard'];


    if (data.difficulties.length > 1) {
        var maxInstructions = {}
        var generatedBlocks = {}
        generatedBlocks[context_key] = {}
        var singleBlocks = {}
        singleBlocks[context_key] = {}
        for (var i = 0; i < data.difficulties.length; i++) {
            if (i >= levels.length) continue;
            var level = levels[i];
            generatedBlocks[context_key][level] = data.difficulties[i].gridInfo.generatedBlocks || [];
            singleBlocks[context_key][level] = data.difficulties[i].gridInfo.singleBlocks || [];
        }
        generatedBlocks[context_key]['shared'] = data.generatedBlocks || [];
        generatedBlocks[context_key]['shared'] = data.standardBlocks.singleBlocks || [];
    } else {
        var generatedBlocks = {};
        generatedBlocks[context_key] = data.generatedBlocks || [];
        var singleBlocks = data.standardBlocks.singleBlocks || [];
    }


    return {
        conceptViewer: !!data.conceptViewer,
        contextType: data.context,
        includeBlocks: {
            groupByCategory: !!data.groupByCategory,
            generatedBlocks: generatedBlocks,
            standardBlocks: {
                includeAll: !!data.standardBlocks.includeAll,
                wholeCategories: data.standardBlocks.wholeCategories || [],
                singleBlocks: singleBlocks
            }
        }
    };
}