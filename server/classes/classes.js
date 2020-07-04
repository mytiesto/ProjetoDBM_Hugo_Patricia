const fs = require('fs');
var mustache = require('mustache');

//schema = {name, path}
var generate = function (schema, dbname){
    let schemaJSON = JSON.parse(fs.readFileSync(schema["path"]));
    let view = {
        title: schemaJSON["title"],
        titleLC: schemaJSON["title"],
        arguments: "",
        references: [],
        MMReferences: [],
        hasMMReferences: false,
        dbname: dbname,
        properties: [],
        updateProperties: "",
        insertProperties: "",
        values: "",
        enumerables: []
    }

    Object.entries(schemaJSON["properties"]).forEach(function(elem){
        let key = elem[0];

        view.arguments += key+", ";

        view.properties.push({name: key});

        view.updateProperties += key+" = ?, ";

        view.insertProperties += "this."+key+", ";

        view.values += "?, ";

        if(!schemaJSON["required"].includes(key))
            view.enumerables.push({name: key});
    });
    if(schemaJSON["references"])
        Object.entries(schemaJSON["references"]).forEach(function(elem){
            let reference = elem[1];
            if(reference.relation != "M-M"){
                let col = reference.model+"_id";
                view.arguments += col+", ";
                view.properties.push({name: col});
                view.updateProperties += col+" = ?, ";
                view.insertProperties += "this."+col+", ";
                view.values += "?, ";
                view.references.push(reference);
            } else {
                view.MMReferences.push(reference);
            }
            
        })
    view.hasMMReferences = view.MMReferences.length > 0;
    let length = view.arguments.length;
    view.arguments = view.arguments.substring(0, length-2);

    length = view.updateProperties.length;
    view.updateProperties = view.updateProperties.substring(0, length-2);

    length = view.insertProperties.length;
    view.insertProperties = view.insertProperties.substring(0, length-2);

    length = view.values.length;
    view.values = view.values.substring(0, length-2);
        
    fs.readFile('./server/classes/class.mustache', function(err, data){
        var output = mustache.render(data.toString(), view);
        fs.writeFileSync('./publish/Models/'+schema["name"]+'.js', output);
    });
}

module.exports = generate;