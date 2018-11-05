'use strict';

$(() => {
    showHosts();
});

Io.on('getHosts', (type, value) => {
    if (type == 'all') {
        showHosts();
    } else {
        if (type == 'add') {
            $('#computers').append(getListElement(replaced, value));
        } else if (type == 'delete') {
            $(`li[title="${value.host}"]`).remove();
        } else if (type == 'change') {
            value.name = value.oldName;
            changeListElement(value, true);
        }
    }
});

Io.on('changeHost', value => {
    changeListElement(value);
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
            tmp.append(getListElement(replaced, device));
        });
    })
    .catch(err => console.log(err));
}

function getBadge(value) {
    return `<span class="float-right badge badge-light badge-pill">${value.host} - ${value.name}</span>`;
}

function getText(value) {
    return `Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}`;
}

function getListElement(replaced, value) {
    return `<li id="${replaced}" title="${value.host}" class="list-group-item">Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}<span class="float-right badge badge-light badge-pill">${value.host} - ${value.name}</span></li>`;
}

function changeListElement(value, changeId = false) {
    const replaced = value.name.split(' ').join("_");
    const tmp = $('#' + replaced);

    if (changeId) {
        tmp.attr('id', value.newName.split(' ').join("_"));
    }

    tmp.toggleClass('bg-success', value.alive);
    tmp.toggleClass('bg-danger', !value.alive);
    tmp.text(getText(value));
    $(getBadge(value)).appendTo(tmp);
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