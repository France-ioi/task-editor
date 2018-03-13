module.exports = function(app) {

    app.use((req, res, next) => {
        if('old_filename' in req.body && req.body.old_filename.indexOf('./') !== -1) {
            return res.status(400).send('Wrong filename')
        }
        if('new_filename' in req.body && req.body.new_filename.indexOf('./') !== -1) {
            return res.status(400).send('Wrong filename')
        }
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