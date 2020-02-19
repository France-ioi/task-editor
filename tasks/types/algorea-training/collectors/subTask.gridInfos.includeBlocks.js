module.exports = function (data) {

    return {
        groupByCategory: !!data.groupByCategory,
        generatedBlocks: {
            robot: 'easy' in data.generatedBlocks ? data.generatedBlocks : data.generatedBlocks.shared
        },
        standardBlocks: {
            includeAll: !!data.standardBlocks.includeAll,
            wholeCategories: data.standardBlocks.wholeCategories || [],
            singleBlocks: 'easy' in data.standardBlocks.singleBlocks ? data.standardBlocks.singleBlocks : data.standardBlocks.singleBlocks.shared
        }
    };
};
