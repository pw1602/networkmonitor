Io.on('connect', () => growlMsg('success', "Połączono z serwerem", "Nastąpiło połączenie z serwerem socket.io!", 'steadysets-wifi-full'));
Io.on('disconnect', reason => growlMsg('error', "Rozłączono z serwerem", reason, 'steadysets-wifi-low'));
Io.on('connect_error', error => growlMsg('error', "Błąd połączenia", error, 'steadysets-wifi-low'));
Io.on('connect_timeout', timeout => growlMsg('error', "Błąd połączenia", timeout, 'steadysets-wifi-low'));
Io.on('error', error => growlMsg('error', "Błąd", error, 'steadysets-wifi-low'));

function growlMsg(type, title, msg, icon) {
    $.iGrowl({
        type: type,
        title: title,
        message: msg,
        icon: icon
    });
}