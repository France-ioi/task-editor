var detectQuestionType = require('./detect_question_type.js');

module.exports = function(questions) {

    var res = [];
    var groups = {};



    var handlers = {

        input: function(question) {
            switch(question.correct_answer.type) {
                case 'value':
                    return question.correct_answer.value;
                    break;
                case 'function':
                    return new Function('return ' + question.correct_answer.value)();
                    break;
                default:
                    return null;
            }
        },

        fill_gaps: function(question) {
            return {
                strict: true,
                value: question.answers
            }
        },

        single: function(question) {
            return parseInt(question.correct_answer, 10);
        },

        multiple: function(question) {
            var arr = [];
            question.answers.map(function(answer, aidx) {
                if(answer.correct) {
                    arr.push(aidx)
                }
            })
            return arr;
        }
    }


    function getGroupIndex(group_key, initial_idx) {
        if(typeof groups[group_key] === 'undefined') {
            groups[group_key] = initial_idx;
            res[initial_idx] = [];
        }
        return groups[group_key];
    }


    questions.map(function(question) {
        var type = detectQuestionType(question);
        var data = handlers[type](question);
        if(question.group_key) {
            var group_idx = getGroupIndex(question.group_key, res.length);
            res[group_idx].push(data);
        } else {
            res.push(data);
        }
    });

    return res;
}