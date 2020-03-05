var detectQuestionType = require('./detect_question_type.js');

module.exports = function(questions) {

    var res = [];
    var groups = {};


    function getGroupIndex(group_key, initial_idx) {
        if(typeof groups[group_key] === 'undefined') {
            groups[group_key] = initial_idx;
            res[initial_idx] = {
                group: true,
                questions: []
            };
        }
        return groups[group_key];
    }


    questions.map(function(question) {
        question.type = detectQuestionType(question);
        if(question.group_key) {
            var group_idx = getGroupIndex(question.group_key, res.length);
            res[group_idx].questions.push(question);
        } else {
            res.push({
                group: false,
                questions: [question]
            });
        }
    });

    return res;
}