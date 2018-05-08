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
            includeAll: {{includeAllPlaceholder}},
            wholeCategories: {{{wholeCategoriesPlaceholder}}},
				singleBlocks: {{{singleBlocksPlaceholder}}}
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

            initItems:  {{{initItemsMedium}}}


         }
      ],
      {{/mediumTiles}}
      {{#hardTiles}}
      hard: [
         {
             tiles: {{tilesHard}},

          initItems:  {{{initItemsHard}}}

      }
      ]
      {{/hardTiles}}
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy =  {{{titleEasy}}}{{^titleEasy}}{{/titleEasy}} {{displayHelperEasy}};
   displayHelper.thresholdMedium = {{#tilesMedium}},
          {{{titleMedium}}}{{^titleMedium}}{{/titleMedium}} {{displayHelpeMedium}}{{/tilesMedium}};
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
