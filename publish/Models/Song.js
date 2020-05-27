var database = require("../Database/sqlite-wrapper")("./publish/Database/projeto.db");
class Song {
    constructor(name, artist_id, album_id, genre_id) {
        this.name = name;
        this.artist_id = artist_id;
        this.album_id = album_id;
        this.genre_id = genre_id;
        Object.defineProperty(this, "artist_id", { enumerable: false });
        Object.defineProperty(this, "album_id", { enumerable: false });
        Object.defineProperty(this, "genre_id", { enumerable: false });
        Object.defineProperty(this, "id", { enumerable: false, writable: true });
    }

    static all(callback) {
        database.where("SELECT * FROM Song;", [], Song, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Song WHERE id = ?;", [id], Song, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Song WHERE id = ?;", [id], callback)
    }

    save(callback) {
        if (this.id)
            database.run("UPDATE Song SET name = ?, artist_id = ?, album_id = ?, genre_id = ? WHERE id = ?;", [this.name, this.artist_id, this.album_id, this.genre_id, this.id], callback);
        else
            database.run("INSERT INTO Song (name, artist_id, album_id, genre_id) VALUES (?, ?, ?, ?);", [this.name, this.artist_id, this.album_id, this.genre_id], callback);
    }
}

module.exports = Song;