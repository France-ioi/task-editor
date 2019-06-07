module.exports = function(questions) {

    var res = {};
    questions.map(function(question) {
        if('format' in question) {
            res.input = true;
        } else if('correct_answer' in question) {
            res.single = true;
        } else if('fill_gaps_text' in question) {
            res.fill_gaps = true;
        } else {
            res.multiple = true;
        }
    })
    return res;
}