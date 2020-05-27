var database = require("../Database/sqlite-wrapper")("./publish/Database/projeto.db");
class Artist {
    constructor(name) {
        this.name = name;
        Object.defineProperty(this, "id", { enumerable: false, writable: true });
    }

    static all(callback) {
        database.where("SELECT * FROM Artist;", [], Artist, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Artist WHERE id = ?;", [id], Artist, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Artist WHERE id = ?;", [id], callback)
    }

    save(callback) {
        if (this.id)
            database.run("UPDATE Artist SET name = ? WHERE id = ?;", [this.name, this.id], callback);
        else
            database.run("INSERT INTO Artist (name) VALUES (?);", [this.name], callback);
    }
}

module.exports = Artist;