var database = require("../Database/sqlite-wrapper")("./publish/Database/projeto.db");
class Album {
    constructor(name) {
        this.name = name;
        Object.defineProperty(this, "id", { enumerable: false, writable: true });
    }

    static all(callback) {
        database.where("SELECT * FROM Album;", [], Album, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Album WHERE id = ?;", [id], Album, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Album WHERE id = ?;", [id], callback)
    }

    save(callback) {
        if (this.id)
            database.run("UPDATE Album SET name = ? WHERE id = ?;", [this.name, this.id], callback);
        else
            database.run("INSERT INTO Album (name) VALUES (?);", [this.name], callback);
    }
}

module.exports = Album;