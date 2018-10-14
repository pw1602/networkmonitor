Io.on('getHosts', value => {
    const tmp = $('#computers');
    tmp.empty();

    value.forEach(host => {
        tmp.append('<li id="' + host.name + '" class="list-group-item"> Time: ' + host.time + ', min: ' + host.min + ', max: ' + host.max + ', avg: ' + host.avg +'<span class="float-right badge badge-light badge-pill">' + host.ip + ' - ' + host.name + '</span></li>')
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