const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(81);

const App = Express()

App.use(Express.static(__dirname + '/css'));
App.use(Express.static(__dirname + '/html'));
App.use(Express.static(__dirname + '/js'));
App.use(Express.static(__dirname + '/node_modules'));

const HOSTS = [ // Jakie ip/hosty ma pingowac serwer
    ['VirtualBox', '192.168.56.1', 0, 0, 0, 0, 0],
    ['Hamachi', '25.40.221.99', 0, 0, 0, 0, 0],
    ['Android', '192.168.1.44', 0, 0, 0, 0, 0],
];

const PORT = 80; // Port na jakim działa strona
const HTML_SITES_PATH = {
    home: 'index.html'
};

App.get('/', (req, res) => {
    res.sendFile(HTML_SITES_PATH.home);
});

Io.on('connection', socket => Io.emit('getHosts', HOSTS));
App.get('/config', (req, res) => res.send('TEST'));
App.listen(PORT, () => console.log(`App listening on port ${PORT}!`))


setInterval(() => {
    pingHosts();
    Io.emit('getHosts', HOSTS);
}, 1000);

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