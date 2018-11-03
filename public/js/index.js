'use strict';

$(() => {
    showHosts();
});

Io.on('getHosts', (type, value) => {
    if (type == 'all') {
        showHosts();
    } else {
        const computerName = value.name || value.oldName || '';
        const replaced = computerName.split(' ').join("_");
        const tmp = replaced != '' ? $('#' + replaced) : undefined;

        if (type == 'add') {
            $('#computers').append(`<li id="${replaced}" title="${value.host}" class="list-group-item">Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}<span class="float-right badge badge-light badge-pill">${value.host} - ${value.name}</span></li>`);
        } else if (type == 'delete') {
            $(`li[title="${value.host}"]`).remove();
        } else if (type == 'change') {
            tmp.attr('id', value.newName.split(' ').join("_"));
            tmp.toggleClass('bg-success', value.alive);
            tmp.toggleClass('bg-danger', !value.alive);
            tmp.text(`Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}`);
            $(`<span class="float-right badge badge-light badge-pill">${value.host} - ${value.name || value.newName}</span>`).appendTo(tmp);
        }
    }
});

Io.on('changeHost', value => {
    const replaced = value.name.split(' ').join("_");
    const tmp = $('#' + replaced);
    tmp.toggleClass('bg-success', value.alive);
    tmp.toggleClass('bg-danger', !value.alive);
    tmp.text(`Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}`);
    $(`<span class="float-right badge badge-light badge-pill">${value.host} - ${value.name}</span>`).appendTo(tmp);
});

function showHosts() {
    const tmp = $('#computers');
    tmp.empty();

    $.ajax({
       url: 'http://localhost:3000/api/computers',
       method: 'GET' 
    })
    .done(res => {
        res.forEach(device => {
            const replaced = device.name.split(' ').join("_");
            tmp.append(`<li id="${replaced}" title="${device.host}" class="list-group-item">Time: ${device.time}, min: ${device.min}, max: ${device.max}, avg: ${device.avg}<span class="float-right badge badge-light badge-pill">${device.host} - ${device.name}</span></li>`);
        });
    })
    .catch(err => console.log(err));
}

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