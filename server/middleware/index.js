module.exports = function(app) {

    app.use(function (req, res, next) {
        if('path' in req.body && req.body.path.indexOf('./') !== -1) {
            return res.status(400).send('Wrong path')
        }
        if('dir' in req.body && req.body.dir.indexOf('./') !== -1) {
            return res.status(400).send('Wrong dir')
        }
        next();
    })

}