var user = require('../libs/user')
var url = require('url');

function validatePathParams(body) {
    var params = [
        'old_filename',
        'new_filename',
        'path',
        'path_src',
        'dir'
    ];
    var res = true;
    params.map(param => {
        if(param in body && body[param].indexOf('./') !== -1) {
            res = false;
        }
    })
    return res;
}


module.exports = function(app) {

    app.use((req, res, next) => {
        if('token' in req.body) {
            var pathname = url.parse(req.url).pathname;
            if(pathname != '/api/auth/logout') {
                req.user = user.get(req.body.token)
                if(!req.user) {
                    return res.status(400).send('Auth expired')
                }
            }
        }
        if(!validatePathParams(req.body)) {
            return res.status(400).send('Wrong filename')
        }
        next();
    })


    if(process.env.HTTP_AUTH) {
        var users = JSON.parse(process.env.HTTP_AUTH);
        app.use((req, res, next) => {
            var b64auth = (req.headers.authorization || '').split(' ')[1] || '';
            var tmp = new Buffer(b64auth, 'base64').toString().split(':');
            if(tmp.length !== 2 || users[tmp[0]] !== tmp[1]) {
                res.set('WWW-Authenticate', 'Basic realm="auth"');
                return res.status(401).send('Authentication required.');
            }
            next();
        })
    }

}