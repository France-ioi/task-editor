/*
var str = '[index.js]$varname';
str = str.replace(/^\[.+\]/, '');
console.log(str)
*/

// old code, need update

var path = require('path');
var generator = require('./api/task/generator')

var params = {
    data: require('../task_output/task_content.json'),
    path: path.resolve(__dirname, '../task_output')
}

generator.output(params, err => console.error(err.message));