const express = require('express');
var mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const dbname = "projeto.db";

const backoffice = require('./publish/Controllers/backoffice');
const frontoffice = require('./publish/Controllers/frontoffice');
const editor = require('./publish/Controllers/editor');

const api = require("./publish/Controllers/api");

const app = express();
const port = 8081;
const ip = "localhost";

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/publish/Views'); //indicação de qual a pasta que irá conter as views

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', api);

app.use('/backoffice', backoffice);
app.use('/frontoffice', frontoffice);
app.use('/editor', editor);

//routes

var server = app.listen(port, () => {
    console.log('App listeing at http://'+ip+':'+port);
});

server.on("error", (error) => {
    if(error.message.includes("address already in use"))
        server.close();
});