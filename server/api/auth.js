var user = require('../libs/user')
var svn = require('../libs/svn')
var tree = require('../libs/tree')


module.exports = {

    login: (req, res) => {
        var token = user.findToken(req.body)
        if(token) {
            return res.json({ token })
        }

        tree.readDir(req.body, '', (err, data) => {
            if(err) return res.status(400).send('User not found');
            res.json({
                token: user.add(req.body)
            })
        })
    },


    logout: (req, res) => {
        tree.clear(req.user, '')
        user.remove(req.body.token)
        res.json({});
    },


    credentials: (req, res) => {
        if('token' in req.body) {
            var credentials = user.get(req.body.token)
            if(credentials) {
                return res.json(credentials);
            }
        }
        res.status(400).send('Token not found');
    }
}