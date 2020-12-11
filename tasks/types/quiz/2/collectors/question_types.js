var detectQuestionType = require('./detect_question_type.js');

module.exports = function(questions) {
    var res = {};
    questions.map(function(question) {
        var type = detectQuestionType(question);
        res[type] = true;
    })
    return res;
}