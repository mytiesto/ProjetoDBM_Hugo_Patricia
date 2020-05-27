var database = require("../Database/sqlite-wrapper")("./publish/Database/projeto.db");
class Genre {
    constructor(name) {
        this.name = name;
        Object.defineProperty(this, "id", { enumerable: false, writable: true });
    }

    static all(callback) {
        database.where("SELECT * FROM Genre;", [], Genre, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Genre WHERE id = ?;", [id], Genre, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Genre WHERE id = ?;", [id], callback)
    }

    save(callback) {
        if (this.id)
            database.run("UPDATE Genre SET name = ? WHERE id = ?;", [this.name, this.id], callback);
        else
            database.run("INSERT INTO Genre (name) VALUES (?);", [this.name], callback);
    }
}

module.exports = Genre;