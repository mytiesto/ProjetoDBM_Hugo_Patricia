const fs = require('fs');
var childProcess = require('child_process');
var mustache = require('mustache');
var del = require('del');
del.sync(['Controllers']);
del.sync(['Models']);
del.sync(['Public']);
del.sync(['Views']);

var folders = function(){
    fs.mkdir('Controllers', function(){
    });
    fs.mkdir('Models', function(){
     });
    fs.mkdir('Public', function(){
        fs.mkdir('Public/Css', function(){
        });
        fs.mkdir('Public/Images', function(){
        });
        fs.mkdir('Public/Js', function(){
        });
    });
    fs.mkdir('Views', function(){
    });   
}

const config = JSON.parse(fs.readFileSync('./server/config.json'));
var generate = function(){
    folders();
    fs.readFile('./server/server.mustache', function(err,data) {
        var output = mustache.render(data.toString(), config);
        console.log(output);
        fs.writeFileSync('index.js',output);
    });

    childProcess.fork('index.js');
    
}