let showError = false;
let connError = false;
let recError = false;
let reconnectAttempt = 0;

Io.on('connect_error', error => {
    if (!connError) {
        growlMsg('danger', 'Utracono połączenie', error, 'ban');
        connError = true;
    }
});

Io.on('connect_timeout', (timeout) => {
    growlMsg('danger', 'Limit czasu połączenia', 'Przekroczono limit czasu połączenia: ' + timeout, 'ban');
});

Io.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
        growlMsg('warning', 'Rozłączenie z serwerem', 'Rozłączenie zainicjowane przez serwere. Próba ponownego połączenia.');
        // the disconnection was initiated by the server, you need to reconnect manually
        Io.connect();
    }
    // else the socket will automatically try to reconnect
});

Io.on('reconnect', (attemptNumber) => {
    growlMsg('success', 'Ponowne połączenie z serwerem', 'Połączono z serwerem. (' + attemptNumber + ')', 'wifi');
    reconnectAttempt = 0;
});

Io.on('reconnect_attempt', (attemptNumber) => {
    if (attemptNumber <= 3) {
        reconnectAttempt = attemptNumber;
        growlMsg('warning', 'Ponowne połączenie z serwerem', 'Próba połączenia z serwerem... (' + reconnectAttempt + ' z 3)', 'warning');
    }
});

Io.on('reconnect_failed', () => {
    if (!recError) {
        growlMsg('danger', 'Ponowne połączenie z serwerem', 'Nie udało się połączyć z serwerem.', 'ban');
        recError = true;
    }
});

Io.on('error', error => {
    if (!showError) {
        growlMsg('danger', 'Błąd', error, 'ban');
        showError = true;
    }
});

Io.on('growlMsg', (type, title, msg, icon) => {
    growlMsg(type, title, msg, icon);
});

function growlMsg(type, title, msg, icon) {
    $.notify({
        // options
        icon: 'oi oi-' + icon,
        title: '<b>' + title + '</b><br>',
        message: msg,
        //url: 'https://github.com/mouse0270/bootstrap-notify',
        target: '_blank'
    },{
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 5000,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>' 
    });
}