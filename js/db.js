const Mysql = require('mysql');

class Database {
    constructor() {
        this.connection = Mysql.createPool({
            connectionLimit: 10,
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "networkmonitor"
        });
    }

    getAllComputers() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM computers;", (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    getComputer(id) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM computers WHERE id = ?;", [id], (err, result) => {
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