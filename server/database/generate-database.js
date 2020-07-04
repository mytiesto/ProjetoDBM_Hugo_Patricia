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

var run = function(db, schemas){
    let data = fs.readFileSync('./server/database/dbscript.mustache').toString()
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
}

//1-M, M-M, 1-1 (left-right)
var addReference = (reference, rightTableName) => {
    let fileStr = "./server/database/";
    let relation = reference.relation;
    let leftTableName = reference.model;
    let view;

    switch(relation){
        case '1-M':
            fileStr += "one-to-many.mustache";
            view = {
                rightTableName: rightTableName,
                leftTableName: leftTableName
            }
            break;
        case 'M-M':
            let firstTableName = leftTableName;
            let secondTableName = rightTableName;
            if(leftTableName.localeCompare(rightTableName) == 1){
                firstTableName = rightTableName;
                secondTableName = leftTableName;
            }
            fileStr += "many-to-many.mustache";
            view = {
                firstTableName: firstTableName,
                secondTableName: secondTableName
            }
            break;
        case '1-1':
            fileStr += "one-to-one.mustache";
            view = {
                rightTableName: rightTableName,
                leftTableName: leftTableName,
            }
            break;
    }
    let data = fs.readFileSync(fileStr).toString();
    return mustache.render(data, view);
}

var generate = function(dbName, schemas, callback){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./publish/Database/'+dbName);   
    run(db, schemas);
    db.close(callback);
}

var generateRelations = (dbName, schemas) => {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./publish/Database/'+dbName);
    let script = '';
    schemas.forEach(schema => {
        let schemaJSON = JSON.parse(fs.readFileSync(schema.path));
        let references = schemaJSON.references;
        if(references != undefined){
            references.forEach(reference => {
                script += addReference(reference, schema.name);
            })
        }
    });
    db.exec(script);
    db.close();
}

module.exports = {
    generate: generate,
    generateRelations: generateRelations
};