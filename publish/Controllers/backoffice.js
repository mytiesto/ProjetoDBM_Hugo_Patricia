const express = require('express');
var router = express.Router();
var mustacheExpress = require('mustache-express');

var Album = require('../Models/Album.js');
var schemaAlbum = require('../Schemas/AlbumSchema.json');
var Artist = require('../Models/Artist.js');
var schemaArtist = require('../Schemas/ArtistSchema.json');
var Genre = require('../Models/Genre.js');
var schemaGenre = require('../Schemas/GenreSchema.json');
var Song = require('../Models/Song.js');
var schemaSong = require('../Schemas/SongSchema.json');

var objWithInputTypes = (schema, obj) => { //Adds {type: ...}
    Object.entries(schema.properties).forEach(([property, value]) => {
        let type;
        switch(value.type){
            case "string":
                type = "text";
                break;
            case "integer": case "number":
                type = "number";
                break;
        }
        let index = obj.findIndex(elem => elem.name == property);
        obj[index].type = type;
    })
    return obj;
}

var objWithInputRequired = (schema, obj) => { //Adds {required: ...}
    schema.required.forEach(requiredProperty => {
        let index = obj.findIndex(elem => elem.name == requiredProperty);
        obj[index].required = "required";
    })
    return obj;
}

var objWithValidPropertiesAndValues = (schema, record) => {
    let allProps = Object.getOwnPropertyNames(record);
    let validProps = [];
    allProps.forEach(function (property){
        if(schema.properties.hasOwnProperty(property)){
            let presentationMode = schema.properties[property].presentationMode;
            validProps.push({
                name: property,
                value: record[property],
                required: "",
                isElse: presentationMode == undefined,
                isImage: presentationMode == "image",
                isVideo: presentationMode == "video"
                });
        }
    })
    return validProps;
}

var objWithAllPropertiesAndValues = (schema, record) => {
    let allProps = Object.getOwnPropertyNames(record);
    let obj = [];
    allProps.forEach(function (property){
        obj.push({name: property, value: record[property], required: ""});
    })
    return obj;
}

var objWithValidProperties = (schema) => {
    let validProps = [];
    Object.entries(schema.properties).forEach(([property, value]) => {
        validProps.push({name: property, required: ""});
    })
    return validProps;
}

var objReferences = (schema, row, id, title) => {
    var allRefs = [];
    if (schema.references) {
        schema.references.forEach(function (ref) {
            allRefs.push({
                labelRef: ref.label,
                model: ref.model,
                values: ref.relation === "M-M" ? '/'+title+'/' + id : row[(ref.model + "_id")],
                isManyToMany: ref.relation === "M-M"
            });
        });
    }
    return allRefs;
}

var navView = (activeSchema) => {
    let schemas = []
    schemas.push({
        isCurrentPage: 'Album' == activeSchema,
        href: '/Album',
        name: 'Album'
    })
    schemas.push({
        isCurrentPage: 'Artist' == activeSchema,
        href: '/Artist',
        name: 'Artist'
    })
    schemas.push({
        isCurrentPage: 'Genre' == activeSchema,
        href: '/Genre',
        name: 'Genre'
    })
    schemas.push({
        isCurrentPage: 'Song' == activeSchema,
        href: '/Song',
        name: 'Song'
    })
    return schemas;
}

var Album = require('../Models/Album.js');
var schemaAlbum = require('../Schemas/AlbumSchema.json');

router.get('/Album', function (req, res) {
    let view = {
        title: "Album",
        columns: "",
        rows: [],
        schemas: navView('Album'),
        hasNoCurrentPage: false
    }
    Album.all(rows => {
        rows.forEach((elem,index) => {
            let keys = Object.keys(elem);
            if(index == 0)
                view.columns = keys;
            view.rows.push({properties: [], id: elem.id});
            Object.keys(elem).forEach(property => {
                view.rows[index].properties.push(elem[property]);
            })
        })
        res.render('list', view);
    });
});

router.get('/Album/Details/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Album",
        properties: "",
        id: id,
        references: [],
        hasReferences: false,
        schemas: navView('Album'),
        hasNoCurrentPage: false
    }
    Album.get(id, record => {
        view.references = objReferences(schemaAlbum, record, id, "Album");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        view.properties = objWithValidPropertiesAndValues(schemaAlbum, record);
        res.render('details', view);
    });
});

router.get('/Album/Insert', function (req, res) {
    let view = {
        title: "Album",
        properties: objWithValidProperties(schemaAlbum),
        references: schemaAlbum["references"],
        hasReferences: false,
        schemas: navView('Album'),
        hasNoCurrentPage: false
    }
    view.hasReferences = view.references != undefined && view.references.length > 0;
    res.render('insert', view);
});

router.get('/Album/Edit/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Album",
        id: id,
        properties: "",
        references: schemaAlbum["references"],
        hasReferences: false,
        schemas: navView('Album'),
        hasNoCurrentPage: false
    }
    Album.get(id, record => {
        view.references = objReferences(schemaAlbum, record, id, "Album");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        let validProps = objWithValidPropertiesAndValues(schemaAlbum, record);
        validProps = objWithInputRequired(schemaAlbum, validProps);
        validProps = objWithInputTypes(schemaAlbum, validProps);
        view.properties = validProps;
        res.render('edit', view);
    });
});

var Artist = require('../Models/Artist.js');
var schemaArtist = require('../Schemas/ArtistSchema.json');

router.get('/Artist', function (req, res) {
    let view = {
        title: "Artist",
        columns: "",
        rows: [],
        schemas: navView('Artist'),
        hasNoCurrentPage: false
    }
    Artist.all(rows => {
        rows.forEach((elem,index) => {
            let keys = Object.keys(elem);
            if(index == 0)
                view.columns = keys;
            view.rows.push({properties: [], id: elem.id});
            Object.keys(elem).forEach(property => {
                view.rows[index].properties.push(elem[property]);
            })
        })
        res.render('list', view);
    });
});

router.get('/Artist/Details/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Artist",
        properties: "",
        id: id,
        references: [],
        hasReferences: false,
        schemas: navView('Artist'),
        hasNoCurrentPage: false
    }
    Artist.get(id, record => {
        view.references = objReferences(schemaArtist, record, id, "Artist");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        view.properties = objWithValidPropertiesAndValues(schemaArtist, record);
        res.render('details', view);
    });
});

router.get('/Artist/Insert', function (req, res) {
    let view = {
        title: "Artist",
        properties: objWithValidProperties(schemaArtist),
        references: schemaArtist["references"],
        hasReferences: false,
        schemas: navView('Artist'),
        hasNoCurrentPage: false
    }
    view.hasReferences = view.references != undefined && view.references.length > 0;
    res.render('insert', view);
});

router.get('/Artist/Edit/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Artist",
        id: id,
        properties: "",
        references: schemaArtist["references"],
        hasReferences: false,
        schemas: navView('Artist'),
        hasNoCurrentPage: false
    }
    Artist.get(id, record => {
        view.references = objReferences(schemaArtist, record, id, "Artist");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        let validProps = objWithValidPropertiesAndValues(schemaArtist, record);
        validProps = objWithInputRequired(schemaArtist, validProps);
        validProps = objWithInputTypes(schemaArtist, validProps);
        view.properties = validProps;
        res.render('edit', view);
    });
});

var Genre = require('../Models/Genre.js');
var schemaGenre = require('../Schemas/GenreSchema.json');

router.get('/Genre', function (req, res) {
    let view = {
        title: "Genre",
        columns: "",
        rows: [],
        schemas: navView('Genre'),
        hasNoCurrentPage: false
    }
    Genre.all(rows => {
        rows.forEach((elem,index) => {
            let keys = Object.keys(elem);
            if(index == 0)
                view.columns = keys;
            view.rows.push({properties: [], id: elem.id});
            Object.keys(elem).forEach(property => {
                view.rows[index].properties.push(elem[property]);
            })
        })
        res.render('list', view);
    });
});

router.get('/Genre/Details/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Genre",
        properties: "",
        id: id,
        references: [],
        hasReferences: false,
        schemas: navView('Genre'),
        hasNoCurrentPage: false
    }
    Genre.get(id, record => {
        view.references = objReferences(schemaGenre, record, id, "Genre");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        view.properties = objWithValidPropertiesAndValues(schemaGenre, record);
        res.render('details', view);
    });
});

router.get('/Genre/Insert', function (req, res) {
    let view = {
        title: "Genre",
        properties: objWithValidProperties(schemaGenre),
        references: schemaGenre["references"],
        hasReferences: false,
        schemas: navView('Genre'),
        hasNoCurrentPage: false
    }
    view.hasReferences = view.references != undefined && view.references.length > 0;
    res.render('insert', view);
});

router.get('/Genre/Edit/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Genre",
        id: id,
        properties: "",
        references: schemaGenre["references"],
        hasReferences: false,
        schemas: navView('Genre'),
        hasNoCurrentPage: false
    }
    Genre.get(id, record => {
        view.references = objReferences(schemaGenre, record, id, "Genre");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        let validProps = objWithValidPropertiesAndValues(schemaGenre, record);
        validProps = objWithInputRequired(schemaGenre, validProps);
        validProps = objWithInputTypes(schemaGenre, validProps);
        view.properties = validProps;
        res.render('edit', view);
    });
});

var Song = require('../Models/Song.js');
var schemaSong = require('../Schemas/SongSchema.json');

router.get('/Song', function (req, res) {
    let view = {
        title: "Song",
        columns: "",
        rows: [],
        schemas: navView('Song'),
        hasNoCurrentPage: false
    }
    Song.all(rows => {
        rows.forEach((elem,index) => {
            let keys = Object.keys(elem);
            if(index == 0)
                view.columns = keys;
            view.rows.push({properties: [], id: elem.id});
            Object.keys(elem).forEach(property => {
                view.rows[index].properties.push(elem[property]);
            })
        })
        res.render('list', view);
    });
});

router.get('/Song/Details/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Song",
        properties: "",
        id: id,
        references: [],
        hasReferences: false,
        schemas: navView('Song'),
        hasNoCurrentPage: false
    }
    Song.get(id, record => {
        view.references = objReferences(schemaSong, record, id, "Song");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        view.properties = objWithValidPropertiesAndValues(schemaSong, record);
        res.render('details', view);
    });
});

router.get('/Song/Insert', function (req, res) {
    let view = {
        title: "Song",
        properties: objWithValidProperties(schemaSong),
        references: schemaSong["references"],
        hasReferences: false,
        schemas: navView('Song'),
        hasNoCurrentPage: false
    }
    view.hasReferences = view.references != undefined && view.references.length > 0;
    res.render('insert', view);
});

router.get('/Song/Edit/:id', function (req, res) {
    let id = req.params.id;
    let view = {
        title: "Song",
        id: id,
        properties: "",
        references: schemaSong["references"],
        hasReferences: false,
        schemas: navView('Song'),
        hasNoCurrentPage: false
    }
    Song.get(id, record => {
        view.references = objReferences(schemaSong, record, id, "Song");
        view.hasReferences = view.references != undefined && view.references.length > 0;
        let validProps = objWithValidPropertiesAndValues(schemaSong, record);
        validProps = objWithInputRequired(schemaSong, validProps);
        validProps = objWithInputTypes(schemaSong, validProps);
        view.properties = validProps;
        res.render('edit', view);
    });
});


module.exports = router;