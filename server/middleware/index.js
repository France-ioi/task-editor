module.exports = function(app) {

    app.use((req, res, next) => {
        if('path' in req.body && req.body.path.indexOf('./') !== -1) {
            return res.status(400).send('Wrong path')
        }
        if('dir' in req.body && req.body.dir.indexOf('./') !== -1) {
            return res.status(400).send('Wrong dir')
        }
        next();
    })


    if(process.env.HTTP_AUTH) {
        var users = JSON.parse(process.env.HTTP_AUTH);
        app.use((req, res, next) => {
            var b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            var [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
            if (!login || !password || users[login] !== password) {
                res.set('WWW-Authenticate', 'Basic realm="auth"');
                return res.status(401).send('Authentication required.');
            }
            next();
        })
    }

}