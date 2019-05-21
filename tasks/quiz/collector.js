module.exports = function(questions) {

    var res = [];
    questions.map(function(question) {
        if('format' in question) {
            // input
            switch(question.correct_answer.type) {
                case 'value':
                    res.push(question.correct_answer.value)
                    break;
                case 'function':
                    var func = new Function('return ' + question.correct_answer.value)();
                    res.push(func)
                    break;
                default:
                    res.push(null)
            }
        } else if('correct_answer' in question) {
            // single select
            res.push(parseInt(question.correct_answer, 10))
        } else if('fill_gaps_text' in question) {
            // fill gaps
            res.push(question.answers)
        } else {
            // multiple select
            var arr = [];
            question.answers.map(function(answer, idx) {
                if(answer.correct) {
                    arr.push(idx)
                }
            })
            res.push(arr)
        }
    })
    return res;
}