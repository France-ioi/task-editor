function initTask(subTask) {
    subTask.gridInfos = {
       conceptViewer: {{conceptViewerPlaceholder}},
       contextType: {{contextTypePlaceholder}},
       maxInstructions: {
       {{{titleEasy}}}{{^titleEasy}}easy{{/titleEasy}}: {{maxInstructionsEasy}}{{#tilesMedium}},
       {{{titleMedium}}}{{^titleMedium}}medium{{/titleMedium}}: {{maxInstructionsMedium}}{{/tilesMedium}}{{#tilesHard}},
       {{{titleHard}}}{{^titleHard}}hard{{/titleHard}}: {{maxInstructionsHard}}{{/tilesHard}}
       },
       includeBlocks: {
          groupByCategory: {{groupByCategoryPlaceholder}},
          generatedBlocks: {
             robot: {{{generatedBlocksPlaceholder}}}
          },standardBlocks: {
             includeAll: {{includeAllPlaceholder}},
             wholeCategories: {{{wholeCategoriesPlaceholder}}},
                 singleBlocks: {{{singleBlocksPlaceholder}}}
          }
       }
    };

    subTask.data = {
       {{{titleEasy}}}{{^titleEasy}}easy{{/titleEasy}}: [
           {
               tiles: {{tilesEasy}},
               initItems: {{{initItemsEasy}}}
           }
       ]{{#tilesMedium}},
       {{{titleMedium}}}{{^titleMedium}}medium{{/titleMedium}}: [
           {
               tiles: {{tilesMedium}},
               initItems:  {{{initItemsMedium}}}
           }
       ]{{/tilesMedium}}{{#tilesHard}},
       {{{titleHard}}}{{^titleHard}}hard{{/titleHard}}: [
           {
               tiles: {{tilesHard}},
               initItems:  {{{initItemsHard}}}
           }
       ]{{/tilesHard}}
    };

    initBlocklySubTask(subTask);
    displayHelper.thresholdEasy =  {{thresholdEasy}};
    {{#thresholdMedium}}
    displayHelper.thresholdMedium = {{thresholdMedium}};
    {{/thresholdMedium}}
 }


 initWrapper(initTask, [{{{titleEasy}}}{{^titleEasy}}"easy"{{/titleEasy}}{{#tilesMedium}}, {{{titleMedium}}}{{^titleMedium}}"medium"{{/titleMedium}}{{/tilesMedium}}{{#tilesHard}}, {{{titleHard}}}{{^titleHard}}"hard"{{/titleHard}}{{maxInstructionsHard}}{{/tilesHard}}], null, true);