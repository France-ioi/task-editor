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
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: [],
				singleBlocks: []
         }
      }
   };

   subTask.data = {
      {{{titleEasy}}}{{^titleEasy}}easy{{/titleEasy}}: [
         {
            tiles: {{tilesEasy}}
               ,
            initItems: {{{initItemsEasy}}}
         }
      ]
      {{#mediumTiles}}
      ,medium: [
         {
            tiles: {{tilesMedium}},
            tiles: [
                   [3, 1, 1, 1, 1],
                   [1, 1, 1, 1, 3],
                   [1, 1, 1, 5, 1],
                   [1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1],
               ],
            initItems: [
                  { row: 5, col: 1, dir: 0, type: "green_robot" }
               ]
         }
      ],
      {{/mediumTiles}}
      {{#hardTiles}}
      hard: [
         {
            tiles: [
                   [3, 1, 1, 1, 1],
                   [1, 1, 1, 1, 3],
                   [1, 1, 4, 5, 1],
                   [1, 1, 1, 4, 1],
                   [1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1],
               ],
            initItems: [
                  { "row": 5, "col": 2, dir: 3, type: "green_robot" }
               ]
         }
      ]
      {{/hardTiles}}
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy = 5000;
   displayHelper.thresholdMedium = 10000;
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
