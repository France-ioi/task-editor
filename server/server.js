require('node-env-file')(__dirname + '/../.env')
var config = require('./config')
var express = require('express');
var app = express();


app.use(express.static('public'));
app.use(config.url_prefix, express.static(config.path));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
var config = JSON.stringify(require('./config'));
app.get('/', (req, res) => {
    res.status(200).render('index.html', { config });
});



var bodyParser = require('body-parser')
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
app.use(fileUpload());
require('./middleware')(app);
require('./routes')(app);


app.listen(process.env.PORT, () => {
    console.log('task-editor listening on port ' + process.env.PORT);
});