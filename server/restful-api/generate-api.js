const fs = require('fs');
var mustache = require('mustache');

var generate = (schemas) => {
    let view = {
        schemas: []
    };

    schemas.forEach((elem) => {
        view.schemas.push({ name: elem.name });
    });

    fs.readFile('./server/restful-api/api.mustache', function(err, data){
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Controllers/api.js', output);
    });
};

var generateBackoffice = (schemas) => {
    let view = {
        schemas: schemas.map(elem => {return {title: elem.name}})
    }
    fs.readFile('./server/backoffice/backoffice.mustache', (err, data) => {
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Controllers/backoffice.js', output);
    })
}

var generateFrontoffice = (schemas) => {
    let view = {
        schemas: schemas.map(elem => {return {title: elem.name}})
    }
    fs.readFile('./server/frontoffice/frontoffice.mustache', (err, data) => {
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Controllers/frontoffice.js', output);
    })
}

var generateEditor = (schemas) => {
    let view = {
        schemas: schemas.map(elem => {return {title: elem.name}})
    }
    fs.readFile('./server/editor/editor.mustache', (err, data) => {
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Controllers/editor.js', output);
    })
}

module.exports = {
    generate: generate,
    generateBackoffice: generateBackoffice,
    generateFrontoffice: generateFrontoffice,
    generateEditor: generateEditor
};