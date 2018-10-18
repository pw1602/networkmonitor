'use strict';
const Mysql = require('mysql');

class Database {
    constructor(config) {
        this.connection = Mysql.createConnection(config);
    }

    getAllComputers() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM komputery;", (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    getComputer(id) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM komputery WHERE id = ?;", [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    addApiLog(method, path) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO api_logs (method, path) VALUES (?, ?);", [method, path], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    addPingLog(computer_id, alive, time, min, max, avg) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO logs (computer_id, alive, time, min, max, avg) VALUES (?, ?, ?, ?, ?, ?);", [computer_id, alive, time, min, max, avg], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Database;