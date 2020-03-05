module.exports = function (data) {

    return {
        groupByCategory: !!data.groupByCategory,
        generatedBlocks: {
            robot: data.generatedBlocks.shared_value ? data.generatedBlocks.shared_value : data.generatedBlocks
        },
        standardBlocks: {
            includeAll: !!data.standardBlocks.includeAll,
            wholeCategories: data.standardBlocks.wholeCategories || [],
            singleBlocks: data.standardBlocks.singleBlocks.shared_value ? data.standardBlocks.singleBlocks.shared_value : data.standardBlocks.singleBlocks
        }
    };
};
