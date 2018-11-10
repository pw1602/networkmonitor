const {SITE_PORT, REPEAT_TIME} = require('./config.json');

const Db = new (require('./js/db.js'));
const Express = require('express');
const App = Express();
const Http = require('http').Server(App);
const SocketIo = require('socket.io')(Http);
const ApiRoute = require('./js/api.js');
const Ping = require('ping');

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

let Devices = [];
let pingIntervalVar = undefined;
Http.listen(SITE_PORT, () => {
    console.log(`App listening on port ${SITE_PORT}!`);
    
    Db.getAllComputers()
    .then(result => {
        Devices = result;
        pingIntervalVar = setInterval(pingHosts, REPEAT_TIME);
    })
    .catch(err => console.log(`App start database error: ${err.code}`));
});

SocketIo.on('connection', socket => {
    socket.on('getHosts', (type, value) => {
        if (type == 'add') {
            Devices.push(value);
        } else if (type == 'delete') {
            const tmp = Devices.findIndex(el => el.host == value.host);

            if(tmp != -1) {
                Devices.splice(tmp, 1);
            }
        } else if (type == 'change') {
            const tmp = Devices.findIndex(el => el.name == value.oldName);

            if (tmp != -1) {
                Devices[tmp].name = value.newName;
            }
        }
        SocketIo.emit('getHosts', type, value);
    });
});

function pingHosts() {
    Devices.forEach(device => {
        Ping.promise.probe(device.host)
        .then(res => {
            if (device.tries == undefined) {
                device.tries = 0
            }

            if (res.alive != device.alive) {
                device.tries = 0;
            }

            device.tries += 1;
            device.time = res.time;
            device.min = res.min;
            device.max = res.max;
            device.avg = res.avg;
            device.alive = res.alive;
            SocketIo.emit('changeHost', device);
            
            if (device.tries >= 10) {
                Db.addPingLog(device.id, device.alive, device.time, device.min, device.max, device.avg).catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    });
}