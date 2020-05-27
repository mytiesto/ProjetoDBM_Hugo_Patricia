const fs = require('fs');
var mkdirp = require('mkdirp');
var childProcess = require('child_process');
var mustache = require('mustache');
var del = require('del');

var generateClass = require('./classes/classes');
var generateDB = require('./database/generate-database');
var generateAPI = require('./restful-api/generate-api');

const config = JSON.parse(fs.readFileSync('./server/config.json'));

var generateDirectories = function(){
    //criar diretorias
    config["folders"].forEach(function(elem1){
        let root = "./publish/"
        let path = root;
        if(typeof elem1 == "string"){
            path += elem1;
            mkdirp.sync(path);
        } else {
            console.log(path);
            let parentFolder = Object.keys(elem1)[0];
            let parentPath = parentFolder+"/";
            elem1[parentFolder].forEach(function(elem2){
                path = root + parentPath + elem2;
                mkdirp.sync(path);
            });
        }
    });
}

var copyStaticFiles = function(){
    let staticFiles = config["staticFiles"];

    staticFiles.forEach(function(elem){
        fs.copyFileSync(elem["originalPath"], elem["destinationPath"]);
    });
}

var generateSchemas = function(){
    let schemas = config["schemas"];
    let schemasJSON = [];
    if(schemas != undefined){
        let schemasDir = './publish/Schemas';
        if(!fs.existsSync(schemasDir))
            fs.mkdirSync(schemasDir);
        schemas.forEach(function(elem){
            let split = elem["path"].split("/");
            let length = split.length;
            let toPath = schemasDir+"/"+split[length-1];
            fs.copyFileSync(elem["path"], toPath);
            
            schemasJSON.push(elem);
            generateClass(elem, config["dbname"]);
        });
    }
    return schemasJSON;
}

var generate = function(){
    del.sync(['publish']);

    generateDirectories();

    copyStaticFiles();

    let schemas = generateSchemas();
    generateDB(config["dbname"], schemas);

    generateAPI(schemas);

    fs.readFile('./server/server.mustache', function(err,data) {
        var output = mustache.render(data.toString(), config);
        fs.writeFileSync('index.js',output);
    });

    //childProcess.fork('index.js');
    
}

generate();

//module.exports = generate;