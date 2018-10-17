const Express = require('express');
const Router = Express.Router();
const Database = require('./db.js');
const Db = new Database({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'networkmonitor'
});

/*Router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path)
    next();
});*/

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

module.exports = Router;