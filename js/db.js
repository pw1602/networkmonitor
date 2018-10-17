'use strict';
const Mysql = require('mysql');

class Database {
    constructor(config) {
        this.connection = Mysql.createConnection(config);
    }

    getAllComputers() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM komputery", (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    getComputer(id) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM komputery WHERE id = ?", [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Database;