const DEVICES = [ // Jakie ip/hosty ma pingowac serwer
    {
        name: 'VirtualBox',
        host: '192.168.56.1'
    },
    {
        name: 'Hamachi',
        host: '25.40.221.99'
    },
    {
        name: 'Android',
        host: '192.168.1.44'
    }
];

const SITE_PORT = 3000; // Port na jakim działa strona
const SOCKET_PORT = 3001; // Port na jakim działa socket.io
const REPEAT_TIME = 1000; // Co ile powtarza się pingowanie (ms)

const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(SOCKET_PORT);
const App = Express()

App.use(Express.static(__dirname + '/node_modules'));

const VIEWS = {
    home: __dirname + '/public/views/index.html',
    config:  __dirname + '/public/views/config.html'
}

App.get('/', (req, res) => res.sendFile(VIEWS.home));
App.get('/config', (req, res) => res.sendFile(VIEWS.config));

App.listen(SITE_PORT, () => console.log(`App listening on port ${SITE_PORT}!`))

Io.on('connection', socket => Io.emit('getHosts', DEVICES));

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