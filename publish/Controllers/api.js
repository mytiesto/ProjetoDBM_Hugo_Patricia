var express = require('express');
var router = express.Router();

var Album = require('../Models/Album.js');

router.post('/Album', function (req, res) {
    let newAlbum = Object.assign(new Album(), req.body);
    newAlbum.save((ret) => {
        if(ret.success)
            res.send("Album created with success");
        else
            res.send(ret.error);
    });
});

router.get('/Album', function (req, res) {
    Album.all((rows) => {
        res.send(JSON.stringify(rows));
    });
});

router.get('/Album/:id', function (req, res) {
    let id = req.params.id;
    Album.get(id, (row) => {
        res.send(JSON.stringify(row));
    });
});

router.put('/Album/:id', function (req, res) {
    let obj = Object.assign(new Album(), req.body);
    obj.id = req.params.id;
    obj.save((ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Album updated with success");
            else
                res.send("Album with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});

router.delete('/Album/:id', function (req, res) {
    let id = req.params.id;
    Album.delete(id, (ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Album deleted with success");
            else
                res.send("Album with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});
var Artist = require('../Models/Artist.js');

router.post('/Artist', function (req, res) {
    let newArtist = Object.assign(new Artist(), req.body);
    newArtist.save((ret) => {
        if(ret.success)
            res.send("Artist created with success");
        else
            res.send(ret.error);
    });
});

router.get('/Artist', function (req, res) {
    Artist.all((rows) => {
        res.send(JSON.stringify(rows));
    });
});

router.get('/Artist/:id', function (req, res) {
    let id = req.params.id;
    Artist.get(id, (row) => {
        res.send(JSON.stringify(row));
    });
});

router.put('/Artist/:id', function (req, res) {
    let obj = Object.assign(new Artist(), req.body);
    obj.id = req.params.id;
    obj.save((ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Artist updated with success");
            else
                res.send("Artist with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});

router.delete('/Artist/:id', function (req, res) {
    let id = req.params.id;
    Artist.delete(id, (ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Artist deleted with success");
            else
                res.send("Artist with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});
var Genre = require('../Models/Genre.js');

router.post('/Genre', function (req, res) {
    let newGenre = Object.assign(new Genre(), req.body);
    newGenre.save((ret) => {
        if(ret.success)
            res.send("Genre created with success");
        else
            res.send(ret.error);
    });
});

router.get('/Genre', function (req, res) {
    Genre.all((rows) => {
        res.send(JSON.stringify(rows));
    });
});

router.get('/Genre/:id', function (req, res) {
    let id = req.params.id;
    Genre.get(id, (row) => {
        res.send(JSON.stringify(row));
    });
});

router.put('/Genre/:id', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.id = req.params.id;
    obj.save((ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Genre updated with success");
            else
                res.send("Genre with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});

router.delete('/Genre/:id', function (req, res) {
    let id = req.params.id;
    Genre.delete(id, (ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Genre deleted with success");
            else
                res.send("Genre with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});
var Song = require('../Models/Song.js');

router.post('/Song', function (req, res) {
    let newSong = Object.assign(new Song(), req.body);
    newSong.save((ret) => {
        if(ret.success)
            res.send("Song created with success");
        else
            res.send(ret.error);
    });
});

router.get('/Song', function (req, res) {
    Song.all((rows) => {
        res.send(JSON.stringify(rows));
    });
});

router.get('/Song/:id', function (req, res) {
    let id = req.params.id;
    Song.get(id, (row) => {
        res.send(JSON.stringify(row));
    });
});

router.put('/Song/:id', function (req, res) {
    let obj = Object.assign(new Song(), req.body);
    obj.id = req.params.id;
    obj.save((ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Song updated with success");
            else
                res.send("Song with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});

router.delete('/Song/:id', function (req, res) {
    let id = req.params.id;
    Song.delete(id, (ret) => {
        if(ret.success){
            if(ret.rowsAffected > 0)
                res.send("Song deleted with success");
            else
                res.send("Song with that id not found");
        } else {
            res.send(ret.error)
        }
    });
});

module.exports = router;