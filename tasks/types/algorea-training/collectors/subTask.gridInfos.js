module.exports = function (data) {

    var defaults = {
        max_instructions: 10
    }
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
            maxInstructions[level] = data.difficulties[i].gridInfo.maxInstructions || defaults.max_instructions;
            generatedBlocks[context_key][level] = data.difficulties[i].gridInfo.generatedBlocks || [];
            singleBlocks[context_key][level] = data.difficulties[i].gridInfo.singleBlocks || [];
        }
        generatedBlocks[context_key]['shared'] = data.generatedBlocks || [];
        generatedBlocks[context_key]['shared'] = data.standardBlocks.singleBlocks || [];
    } else {
        var maxInstructions = data.difficulties[0].gridInfo.maxInstructions || defaults.max_instructions;
        var generatedBlocks = {};
        generatedBlocks[context_key] = data.generatedBlocks || [];
        var singleBlocks = data.standardBlocks.singleBlocks || [];
    }


    return {
        conceptViewer: !!data.conceptViewer,
        contextType: data.context,
        maxInstructions: maxInstructions,
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