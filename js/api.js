const {DBCONFIG} = require('../config.json');
const Express = require('express');
const Router = Express.Router();
const BodyParser = require('body-parser');
const Db = new (require('./db.js'))(DBCONFIG);
let SocketIo = null;

const jsonParser = BodyParser.json();

Router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path)
    //Db.addApiLog(req.method, req.path).catch(err => console.log(err));
    next();
});

Router.param('computerId', (req, res, next, id) => {
    Db.getComputer(id)
    .then(result => res.json(result))
    .catch(err => console.log(err));

    next();
});

Router.get('/computers', (req, res, next) => {
    Db.getAllComputers()
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

Router.get('/computers/:computerId', (req, res, next) => {});

/*Router.post('/computers', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
});*/

module.exports = Router;
module.exports.io = (io) => SocketIo = io;