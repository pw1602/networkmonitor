const Express = require('express')
const Ping = require('ping');
const Io = require('socket.io')(8080);

const App = Express()

App.use(Express.static(__dirname + '/css'));
App.use(Express.static(__dirname + '/html'));
App.use(Express.static(__dirname + '/js'));
App.use(Express.static(__dirname + '/node_modules'));

const HOSTS = [['192.168.56.1', 0], ['25.40.221.99', 0]]; // Jakie ip/hosty ma pingowac serwer
const PORT = 3000; // Port na jakim działa strona
const HTML_SITES_PATH = {
    home: 'index.html'
};

App.get('/', (req, res) => {
    res.sendFile(HTML_SITES_PATH.home);
});

Io.on('connection', socket => Io.emit('getHosts', HOSTS));
App.get('/config', (req, res) => res.send('TEST'));
App.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


setInterval(() => {
    pingHosts();
    Io.emit('getHosts', HOSTS);
}, 1000);

function pingHosts() {
    HOSTS.forEach((host, index) => {
        Ping.promise.probe(host[0]).then(res => HOSTS[index][1] = res.alive);
    });
}