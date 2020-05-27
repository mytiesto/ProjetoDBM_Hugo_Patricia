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

module.exports = generate;