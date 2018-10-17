Io.on('getHosts', value => {
    const tmp = $('#computers');
    tmp.empty();

    value.forEach(device => {
        tmp.append('<li id="' + device.name + '" class="list-group-item"> Time: ' + device.time + ', min: ' + device.min + ', max: ' + device.max + ', avg: ' + device.avg +'<span class="float-right badge badge-light badge-pill">' + device.ip + ' - ' + device.name + '</span></li>')
    });
});

Io.on('changeHost', value => {
    const tmp = $('#' + value.name);
    tmp.toggleClass('bg-success', value.alive);
    tmp.toggleClass('bg-danger', !value.alive);
    tmp.text('Time: ' + value.time + ', min: ' + value.min + ', max: ' + value.max + ', avg: ' + value.avg);
    $('<span class="float-right badge badge-light badge-pill">' + value.ip + ' - ' + value.name + '</span>').appendTo(tmp);
});

const btnAll = $('#all');
const btnActive = $('#active');
const btnInactive = $('#inactive');

btnAll.click(() => {
    $('#computers > li').each((index, el) => {
        el.removeAttribute('hidden');
    });

    if (!btnAll.hasClass('active')) {
        btnAll.addClass('active');
    }

    btnActive.removeClass('active');
    btnInactive.removeClass('active');
});

btnActive.click(() => {
    $('#computers > li').each((index, el) => {
        el.toggleAttribute('hidden', jQuery.inArray('bg-success', el.classList) == -1);
    });

    if (!btnActive.hasClass('active')) {
        btnActive.addClass('active');
    }

    btnAll.removeClass('active');
    btnInactive.removeClass('active');
});

btnInactive.click(() => {
    $('#computers > li').each((index, el) => {
        el.toggleAttribute('hidden', jQuery.inArray('bg-danger', el.classList) == -1);
    });

    if (!btnInactive.hasClass('active')) {
        btnInactive.addClass('active');
    }

    btnActive.removeClass('active');
    btnAll.removeClass('active');
});