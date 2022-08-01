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


function getAuth(req) {
    function find(src) {
        if('session' in src && 'token' in src) {
            return {
                session: src.session,
                token: src.token
            }
        }
    }
    return find(req.body) || find(req.query)
}


module.exports = function(app) {

    app.use((req, res, next) => {
        req.auth = getAuth(req)
        if(!req.auth) {
            return res.status(400).send('session and token params required')   
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