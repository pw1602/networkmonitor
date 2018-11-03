const {SOCKET_PORT, SITE_PORT, REPEAT_TIME} = require('./config.json');

const Db = new (require('./js/db.js'));
const Express = require('express')
const Ping = require('ping');
const SocketIo = require('socket.io')(SOCKET_PORT);
const App = Express()
const ApiRoute = require('./js/api.js');
ApiRoute.db(Db);

const VIEWS = {
    home: __dirname + '/public/views/index.html',
    config:  __dirname + '/public/views/config.html'
}


App.enable('trust proxy');
App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home));
App.get('/config', (req, res) => res.sendFile(VIEWS.config));
App.use('/api',  ApiRoute);

let Devices = null;
let pingIntervalVar = null;
App.listen(SITE_PORT, () => {
    console.log(`App listening on port ${SITE_PORT}!`);
    
    Db.getAllComputers()
    .then(result => {
        Devices = result;
        pingIntervalVar = setInterval(() => pingHosts(), REPEAT_TIME);
    })
    .catch(err => console.log("App start database error: " + err.code));
});

SocketIo.on('connection', socket => {
    socket.on('getHosts', (type, value) => {
        clearInterval(pingIntervalVar);
        Db.getAllComputers()
        .then(result => {
            Devices = result;
            SocketIo.emit('getHosts', type, value);
            pingIntervalVar = setInterval(() => pingHosts(), REPEAT_TIME);
        })
        .catch(err => {
            console.log("SocketIo database error: " + err.code);
            clearInterval(pingIntervalVar);
        });
    });
});

function pingHosts() {
    Devices.forEach(device => {
        Ping.promise.probe(device.host)
        .then(res => {
            device.time = res.time;
            device.min = res.min;
            device.max = res.max;
            device.avg = res.avg;
            device.alive = res.alive;
            SocketIo.emit('changeHost', device);
            //Db.addPingLog(device.id, device.alive, device.time, device.min, device.max, device.avg).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
}