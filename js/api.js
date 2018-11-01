const Express = require('express');
const Router = Express.Router();
const BodyParser = require('body-parser');
let Db = null;

const jsonParser = BodyParser.json();

Router.use((req, res, next) => {
    Db.addApiLog(req.ip.toString(), req.ips.toString(), req.method, req.path).catch(err => console.log(err));
    next();
});

Router.get('/computers', (req, res, next) => {
    Db.getAllComputers()
    .then(result => res.json(result))
    .catch(err => console.log("computers GET error: " + err.code));
});

Router.post('/computers', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    Db.addComputer(req.body.name, req.body.host)
    .then(result => res.send(result))
    .catch(err => console.log("computers POST error: " + err.code));
});

Router.get('/computers/:var', (req, res, next) => {
    Db.getComputer(req.params.var)
    .then(result => res.json(result))
    .catch(err => console.log("computers/:var GET error: " + err.code));
});

Router.delete('/computers/:host', jsonParser, (req, res, next) => {
    if (!req.body) return res.sendStatus(400);

    Db.deleteComputer(req.body.host)
    .then(result => res.send(result))
    .catch(err => console.log("computers DELETE error: " + err.code));
});

Router.put('/computers/:name', jsonParser, (req, res, next) => {
    if (!req.body) return res.sendStatus(400);

    Db.updateComputerName(req.body.oldName, req.body.newName)
    .then(result => res.send(result))
    .catch(err => console.log("computers PUT error: " + err.code));
});

module.exports = Router;
module.exports.db = (db) => Db = db;