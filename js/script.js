const Io = io('http://localhost:8080');

Io.on('update-value', function (value) {
    console.log('received new value', value);
});

Io.on('getHosts', value => {
    const tmp = $('#computers');
    tmp.empty();

    value.forEach((host, index) => {
        if (host[1]) {
            tmp.append('<li class="list-group-item bg-success">Komputer ' + (index + 1) + ' (' + host[0] + ')</li>')
        } else {
            tmp.append('<li class="list-group-item bg-danger">Komputer ' + (index + 1) + ' (' + host[0] + ')</li>')
        }
    });
});