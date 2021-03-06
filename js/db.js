const Mysql = require('mysql');

class Database {
    constructor() {
        this.connection = Mysql.createPool({
            connectionLimit: 100,
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

    getComputer(variable) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM computers WHERE host = ? OR name = ? or id = ?;", [variable, variable, variable], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    getAvgPingLogs() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT COUNT(computer_id) AS count, computer_id AS id, AVG(time) AS time, AVG(min) AS min, AVG(max) AS max, AVG(avg) AS avg FROM logs WHERE create_date >= (NOW() - INTERVAL 10 SECOND) AND create_date <= NOW() GROUP BY computer_id;", (err, result) => {
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

    addPingLog(computer_id, host, alive, time, min, max, avg) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO logs (computer_id, computer_host, alive, time, min, max, avg) VALUES (?, ?, ?, ?, ?, ?, ?);", [computer_id, host, alive, time, min, max, avg], (err, result) => {
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