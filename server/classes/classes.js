const fs = require('fs');
var mustache = require('mustache');

//schema = {name, path}
var generate = function (schema){
    let schemaJSON = JSON.parse(fs.readFileSync(schema["path"]));
    let view = {
        title: schemaJSON["title"],
        arguments: "",
        properties: [],
        enumerables: []
    }

    Object.entries(schemaJSON["properties"]).forEach(function(elem){
        let key = elem[0];
        view.arguments += key+",";
        view.properties.push({name: key});
        if(!schemaJSON["required"].includes(key))
            view.enumerables.push({name: key});
    });

    let length = view.arguments.length;
    view.arguments = view.arguments.substring(0, length-1);

    fs.readFile('./server/classes/class.mustache', function(err, data){
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Models/'+schema["name"]+'.js', output);
    });
}

generate({
    "name": "Album",
     "path": "./server/schemas/AlbumSchema.json"
});