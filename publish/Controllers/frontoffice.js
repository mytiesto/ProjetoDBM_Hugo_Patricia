const express = require('express');
var router = express.Router();
var mustacheExpress = require('mustache-express');
var schemaAlbum = require('../Schemas/AlbumSchema.json');
var schemaArtist = require('../Schemas/ArtistSchema.json');
var schemaGenre = require('../Schemas/GenreSchema.json');
var schemaSong = require('../Schemas/SongSchema.json');

var otherSchemas = (schemaTitle, reference) => {
    let otherSchemas = [];
    otherSchemas.push({
        name: 'None',
        selected: reference == undefined ? 'selected' : ''
    });
        if(schemaTitle != 'Album'){
            otherSchemas.push({
                name: 'Album',
                selected: ''
            });
        }
        if(schemaTitle != 'Artist'){
            otherSchemas.push({
                name: 'Artist',
                selected: ''
            });
        }
        if(schemaTitle != 'Genre'){
            otherSchemas.push({
                name: 'Genre',
                selected: ''
            });
        }
        if(schemaTitle != 'Song'){
            otherSchemas.push({
                name: 'Song',
                selected: ''
            });
        }
    if(reference){
        let index = otherSchemas.findIndex(elem => elem.name == reference.model);
        otherSchemas[index].selected = 'selected';
    }
    return otherSchemas;
}

var relations = (reference) => {
    let relations = [];
    relations.push({
        name: '1-M',
        selected: ''
    });
    relations.push({
        name: 'M-M',
        selected: ''
    });
    relations.push({
        name: '1-1',
        selected: ''
    });
    if(reference){
        let index = relations.findIndex(rel => rel.name == reference.relation);
        relations[index].selected = 'selected';
    }
    return relations;
}

var types = (type) => {
    let types = [];
    types.push({
        name: 'string',
        selected: type == 'string' ? 'selected' : ''
    })
    types.push({
        name: 'number',
        selected: type == 'number' ? 'selected' : ''
    })
    types.push({
        name: 'boolean',
        selected: type == 'boolean' ? 'selected' : ''
    })
    if(!type){
        types.push({
            name: 'reference',
            selected: 'selected'
        })
    }
    return types;
}

var setupCols = (schema, schemaTitle) => {
    let cols = [];
    let col = {
        colName: "",
        types: [],
        required: "",
        otherSchemas: [],
        relations: [],
        disabledRelations: '',
        label: {}
    }

    let properties = schema.properties;
    let keys = Object.keys(properties);
    let arrRequired = schema.required;
    let references = schema.references;

    keys.forEach(elem => {
        cols.push({
            colName: elem,
            types: types(properties[elem].type),
            required: arrRequired.find(req => req == elem) ? 'checked' : '',
            otherSchemas: otherSchemas(schemaTitle),
            relations: relations(),
            disabledRelations: 'disabled',
            label: {
                value: '',
                disabled: 'disabled'
            }
        })
    })

    if(references)
        references.forEach(reference => {
            cols.push({
                colName: reference.model+"_id",
                types: types(),
                required: 'checked',
                otherSchemas: otherSchemas(schemaTitle, reference),
                relations: relations(reference),
                disabledRelations: '',
                label: {
                    value: reference.label,
                    disabled: ''    
                }
            })
        })
    return cols;
}

var setupSchemas = () => {
    let schemas = []
    schemas.push({
        isCurrentPage: false,
        href: '/Album',
        name: 'Album',
        col: setupCols(schemaAlbum, 'Album')
    })
    schemas.push({
        isCurrentPage: false,
        href: '/Artist',
        name: 'Artist',
        col: setupCols(schemaArtist, 'Artist')
    })
    schemas.push({
        isCurrentPage: false,
        href: '/Genre',
        name: 'Genre',
        col: setupCols(schemaGenre, 'Genre')
    })
    schemas.push({
        isCurrentPage: false,
        href: '/Song',
        name: 'Song',
        col: setupCols(schemaSong, 'Song')
    })
    return schemas;
}

router.get('/', (req, res) => {
    let view = {
        schemas: setupSchemas(),
        hasNoCurrentPage: true
    };
    res.render('home', view);
});

module.exports = router;