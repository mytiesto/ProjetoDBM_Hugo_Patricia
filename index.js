const express = require('express');
const bodyParser = require('body-parser')
const dbname = "projeto.db";

const api = require("./publish/Controllers/api");

const app = express();
const port = 8081;
const ip = "localhost";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', api);

//routes

var server = app.listen(port, () => {
    console.log('App listeing at http://'+ip+':'+port);
});

server.on("error", (error) => {
    if(error.message.includes("address already in use"))
        server.close();
});