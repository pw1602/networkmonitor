'use strict';

// Socket Io
Io.on('getHosts', (type, value) => {
    if (type == 'all') {
        showHosts();
    } else {
        if (type == 'add') {
            $('#computers').append(getListElement(value));
        } else if (type == 'delete') {
            const listEl = $(`li[title="${value.host}"]`);
            const divEl = $(`div[title="${value.host}"]`);
            listEl.remove();
            divEl.remove();
        } else if (type == 'change') {
            value.name = value.oldName;
            changeListElement(value);
        }
    }
});

Io.on('changeHost', value => {  
    changeListElement(value);
});

// Normal Functions
$(() => {
    showHosts();
    setInterval(showConnection, 1000);
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
            tmp.append(getListElement(device));
        });
    })
    .catch(err => console.log(err));
}

function getListElement(value) {
    return `<li id="${value.id}" title="${value.host}" class="list-group-item" data-toggle="collapse" data-target="#${'Collapse_' + value.id}" aria-expanded="false" aria-controls="${'Collapse_' + value.id}">${value.host} ${getBadge(value)}</li>` + getCollapse(value);
}

function getBadge(value) {
    return `<span class="float-right badge badge-light">${value.name}</span>`;
}

function getCollapse(value) {
    //`<span>Historia (średni czas) - Time: ${avg.time}, min: ${avg.min}, max: ${avg.max}, avg: ${avg.avg}</span>`
    return `<div id="${'Collapse_' + value.id}" title="${value.host}" class="collapse bg-light text-dark"><span>${getCollapseText(value)}</span></div>`;
}

function getCollapseText(value) {
    return `Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}`;
}

function changeListElement(value) {
    const element = $('#' + value.id);
    const collapse = $('#' + 'Collapse_' + value.id);

    element.toggleClass('bg-success', value.alive);
    element.toggleClass('bg-danger', !value.alive);
    element.text(value.host);
    $(getBadge(value)).appendTo(element);
    collapse.children('span').text(getCollapseText(value));
}

function showConnection() {
    const tmp = $('#dbConnection');
    const connection = Io.connected;

    tmp.toggleClass('badge-success', connection);
    tmp.toggleClass('badge-danger', !connection);
    tmp.text(connection ? 'Połączono z serwerem' : 'Brak połączenia z serwerem');
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