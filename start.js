const VIEWS = {
    home: __dirname + '/public/views/index.html',
    config:  __dirname + '/public/views/config.html'
}

const {DBCONFIG, SOCKET_PORT, SITE_PORT, REPEAT_TIME} = require('./config.json');
const Db = new (require('./js/db.js'))(DBCONFIG);
const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(SOCKET_PORT);
const App = Express()
const ApiRoute = require('./js/api.js');

App.use('/api', ApiRoute);
App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home));
App.get('/config', (req, res) => res.sendFile(VIEWS.config));

App.listen(SITE_PORT, () => console.log(`App listening on port ${SITE_PORT}!`))

Io.on('connection', socket => Db.getAllComputers().then(result => Io.emit('getHosts', result)));

setInterval(() => {
    pingHosts();
}, REPEAT_TIME);

function pingHosts() {
    DEVICES.forEach(device => {
        Ping.promise.probe(device.host).then(res => {
            device.time = res.time;
            device.min = res.min;
            device.max = res.max;
            device.avg = res.avg;
            device.alive = res.alive;
            Io.emit('changeHost', device);
        });
    });
}