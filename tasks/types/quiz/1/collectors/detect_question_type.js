module.exports = function(question) {
    if('format' in question) {
        return 'input';
    } else if('correct_answer' in question) {
        return 'single';
    } else if('fill_gaps_text' in question) {
        return 'fill_gaps';
    } else {
        return 'multiple';
    }
}