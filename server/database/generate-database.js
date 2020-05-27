const fs = require('fs');
const mustache = require('mustache');

var uniqueRequired = function(pKey, pElem, schemaJSON){
    let res = ""
    if(pElem.unique == true)
        res += " UNIQUE";
    if(schemaJSON.required.includes(pKey))
        res += " NOT NULL";
    return res;
}

var checkLength = function(pKey, pElem, minAttribute, maxAttribute){
    let res = "";
    if(typeof pElem[maxAttribute] == "number")
        res += " LENGTH("+pKey+") <= "+pElem[maxAttribute]+" AND";
    if(typeof pElem[minAttribute] == "number")
        res += " LENGTH("+pKey+") >= "+pElem[minAttribute]+" AND";
    return res;
}

var checkValue = function(pKey, pElem){
    let res = "";
    if(typeof pElem["maximum"] == "number")
        res += " "+pKey+" <= "+pElem.maximum+" AND";
    if(typeof pElem["minimum"] == "number")
        res += " "+pKey+" >= "+pElem.minimum+" AND";
    return res;
}

var checkConstraint = function(pKey, pElem, minAttribute, maxAttribute){
    let check1 = checkLength(pKey, pElem, minAttribute, maxAttribute);
    let check2 = checkValue(pKey, pElem);
    let res = "";
    if(check1 != "" || check2 != ""){
        res += " CHECK(";
        if(check1 != "")
            res += check1;
        if(check2 != "")
            res += check2;
    }
    if(res != "")  
        res = res.substring(0, res.length-4)+")";
    return res;
}

var run = function(db, schemas, callback){
    fs.readFile('./server/database/dbscript.mustache', function(err, data){
        let view = {
            "schemas": []
        }
        schemas.forEach(element => {
            let schemaJSON = JSON.parse(fs.readFileSync(element.path));
            let schema = {
                "title": schemaJSON.title,
                "properties": []
            };
            Object.keys(schemaJSON.properties).forEach((pKey, index) => {
                let pElem = schemaJSON.properties[pKey];
                let property = {
                    "property": pKey
                };

                switch(pElem.type){
                    case "string":
                        property.property += " TEXT" + uniqueRequired(pKey, pElem, schemaJSON) + checkConstraint(pKey, pElem, "minimum", "maximum");                     
                        break;
                    case "integer":
                        property.property += " INTEGER" + uniqueRequired(pKey, pElem, schemaJSON) + checkConstraint(pKey, pElem, "minLength", "maxLength");
                        break;
                    case "number":
                        property.property += " REAL" + uniqueRequired(pKey, pElem, schemaJSON) + checkConstraint(pKey, pElem, "minLength", "maxLength");
                        break;
                    case "boolean":
                        property.property += " INTEGER" + uniqueRequired(pKey, pElem, schemaJSON) + "CHECK("+pKey+" == 0 OR "+pKey+" == 1)";
                        break;
                };
                if(index < Object.keys(schemaJSON.properties).length-1)
                    property.property += ",";

                schema.properties.push(property);
            });
            view.schemas.push(schema);
        });
        var output = mustache.render(data.toString(), view);
        db.exec(output);
        callback;
    });
}

var generate = function(dbName, schemas){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./publish/Database/'+dbName);   
    run(db, schemas, function(){
        db.close();
    });
}

module.exports = generate;