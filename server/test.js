require('node-env-file')(__dirname + '/../.env')


var tree = require('./libs/tree')

var user = {
    username: 'dmitriy1',
    password: 'upw42xsB24'
}

/*
tree.readDir(user, '', (err, res) => {
    tree.readDir(user, 'Examples', (err, res) => {
        tree.readDir(user, '', (err, res) => {
            console.log(res)
        })
    })
})
*/

var dir = 'Examples/arduinoBlink/tests'
var dir = ''
tree.readDir(user, dir, (err, res) => {
    console.log(err, res)
})