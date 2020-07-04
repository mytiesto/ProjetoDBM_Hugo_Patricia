const express = require('express');
var router = express.Router();

var schemaAlbum = require('../Schemas/AlbumSchema.json');
var schemaArtist = require('../Schemas/ArtistSchema.json');
var schemaGenre = require('../Schemas/GenreSchema.json');
var schemaSong = require('../Schemas/SongSchema.json');

router.put('/Album', (req, res) => {
    console.log(res.body);
})
router.put('/Artist', (req, res) => {
    console.log(res.body);
})
router.put('/Genre', (req, res) => {
    console.log(res.body);
})
router.put('/Song', (req, res) => {
    console.log(res.body);
})

module.exports = router;