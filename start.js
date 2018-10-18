const {DBCONFIG, SOCKET_PORT, SITE_PORT, REPEAT_TIME} = require('./config.json');
const Db = new (require('./js/db.js'))(DBCONFIG);
const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(SOCKET_PORT);
const App = Express()
const ApiRoute = require('./js/api.js');

const VIEWS = {
    home: __dirname + '/public/views/index.html',
    config:  __dirname + '/public/views/config.html'
}

App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home));
App.get('/config', (req, res) => res.sendFile(VIEWS.config));
App.use('/api', ApiRoute);

let Devices = null;
App.listen(SITE_PORT, () => {
    console.log(`App listening on port ${SITE_PORT}!`);
    
    Db.getAllComputers()
    .then(result => {
        Devices = result;
        setInterval(() => {
            pingHosts();
        }, REPEAT_TIME);
    })
    .catch(err => console.log(err));
});

Io.on('connection', socket => {
    Db.getAllComputers()
    .then(result => {
        Devices = result;
        Io.emit('getHosts', result)
    })
    .catch(err => console.log(err));
});

function pingHosts() {
    Devices.forEach(device => {
        Ping.promise.probe(device.host).then(res => {
            device.time = res.time;
            device.min = res.min;
            device.max = res.max;
            device.avg = res.avg;
            device.alive = res.alive;
            Io.emit('changeHost', device);
            //Db.addPingLog(device.id, device.alive, device.time, device.min, device.max, device.avg).catch(err => console.log(err));
        });
    });
}