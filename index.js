const HOSTS = [ // Jakie ip/hosty ma pingowac serwer
    {
        name: 'VirtualBox',
        ip: '192.168.56.1'
    },
    {
        name: 'Hamachi',
        ip: '25.40.221.99'
    },
    {
        name: 'Android',
        ip: '192.168.1.44'
    }
];

const SITE_PORT = 3000; // Port na jakim działa strona
const SOCKET_PORT = 3001; // Port na jakim działa socket.io
const REPEAT_TIME = 1000; // Co ile powtarza się pingowanie (ms)
const VIEWS = {
    home: 'index.html'
}

const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(SOCKET_PORT);
const App = Express()

App.use(Express.static(__dirname + '/css'));
App.use(Express.static(__dirname + '/js'));
App.use(Express.static(__dirname + '/fonts'));
App.use(Express.static(__dirname + '/views'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home));
//App.get('/config', (req, res) => res.send('TEST'));

App.listen(SITE_PORT, () => console.log(`App listening on port ${SITE_PORT}!`))

Io.on('connection', socket => Io.emit('getHosts', HOSTS));

setInterval(() => {
    pingHosts();
}, REPEAT_TIME);

function pingHosts() {
    HOSTS.forEach(host => {
        Ping.promise.probe(host.ip).then(res => {
            host.time = res.time;
            host.min = res.min;
            host.max = res.max;
            host.avg = res.avg;
            host.alive = res.alive;
            Io.emit('changeHost', host);
        });
    });
}