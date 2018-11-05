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

    getComputersToPing() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT name, host FROM computers;", (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
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

    getComputer(variable) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM computers WHERE host = ? OR name = ? or id = ?;", [variable, variable, variable], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    addApiLog(ip, ips, method, path) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO api_logs (ip, ips, method, path) VALUES (?, ?, ?, ?);", [ip, ips, method, path], (err, result) => {
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

    addComputer(name, host) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO computers (host, name) VALUES (?, ?);", [host, name], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    deleteComputer(host) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM computers WHERE host = ?;", [host], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    updateComputerName(oldName, newName) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE computers SET name = ? WHERE name = ?;", [newName, oldName], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Database;