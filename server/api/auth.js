var user = require('../libs/user')
var repo = require('../libs/repo')


module.exports = {

    login: (req, res) => {
        var token = user.findToken(req.body)
        if(token) {
            return res.json({ token })
        }

        repo.auth(req.body, (err) => {
            if(err) return res.status(400).send('Login or password incorrect');
            res.json({
                token: user.add(req.body)
            })
        })
    },


    logout: (req, res) => {
        if(req.user) {
            tree.clear(req.user, '')
        }
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
