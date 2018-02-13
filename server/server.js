var express = require('express');

var app = express();

app.use(function(req, res, next) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
    });
    next();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'));

var bodyParser = require('body-parser')
app.use(bodyParser.json());

require('./routes/api')(app);

var config = require('./config');
app.get('/', (req, res) => {
    res.status(200).render('index.html', { config: JSON.stringify(config) });
});

app.listen(8080, () => {
    console.log('task-editor listening on port 8080');
});