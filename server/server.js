var express = require('express');
var app = express();


app.use(express.static('public'));
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
require('./routes/api')(app);


app.listen(8080, () => {
    console.log('task-editor listening on port 8080');
});