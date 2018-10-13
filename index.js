const HOSTS = [ // Jakie ip/hosty ma pingowac serwer
//  [Nazwa urządzenia, ip/host, alive, time, min, max, avg] - ['', '', 0, 0, 0, 0, 0]
    ['VirtualBox', '192.168.56.1', 0, 0, 0, 0, 0],
    ['Hamachi', '25.40.221.99', 0, 0, 0, 0, 0],
    ['Android', '192.168.1.44', 0, 0, 0, 0, 0],
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

App.get('/', (req, res) => {
    res.sendFile(VIEWS.home);
});

Io.on('connection', socket => Io.emit('getHosts', HOSTS));
App.get('/config', (req, res) => res.send('TEST'));
App.listen(SITE_PORT, () => console.log(`App listening on port ${SITE_PORT}!`))


setInterval(() => {
    pingHosts();
    Io.emit('getHosts', HOSTS);
}, REPEAT_TIME);

function pingHosts() {
    HOSTS.forEach((host, index) => {
        Ping.promise.probe(host[1]).then(res => {
            HOSTS[index][2] = res.alive
            HOSTS[index][3] = res.time
            HOSTS[index][4] = res.min
            HOSTS[index][5] = res.max
            HOSTS[index][6] = res.avg
        });
    });
}