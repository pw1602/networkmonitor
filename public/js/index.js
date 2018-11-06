'use strict';

$(() => {
    showHosts();
});

Io.on('getHosts', (type, value) => {
    if (type == 'all') {
        showHosts();
    } else {
        if (type == 'add') {
            const replaced = value.name.split(' ').join("_");
            $('#computers').append(getListElement(replaced, value));
        } else if (type == 'delete') {
            const listEl = $(`li[title="${value.host}"]`);
            const divEl = $(`div[title="${value.host}"]`);
            listEl.remove();
            divEl.remove();
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
    return `<span class="float-right badge badge-light badge-pill">${value.name}</span>`;
}

function getCollapse(replaced, value) {
    return `<div id="${replaced + '_Collapse'}" title="${value.host}" class="collapse bg-light text-dark"><span id="collapseSpan">Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}</span></div>`;
}

function getListElement(replaced, value) {
    return `<li id="${replaced}" title="${value.host}" class="list-group-item" data-toggle="collapse" data-target="#${replaced + '_Collapse'}" aria-expanded="false" aria-controls="${replaced + '_Collapse'}">${value.host} ${getBadge(value)}</li>` + getCollapse(replaced, value);
}

function changeListElement(value, changeId = false) {
    const replaced = value.name.split(' ').join("_");
    const element = $('#' + replaced);
    const collapse = $('#' + replaced + '_Collapse');

    if (changeId) {
        const name = value.newName.split(' ').join("_");
        element.attr('id', name);
        collapse.attr('id', name + '_Collapse');
    }

    element.toggleClass('bg-success', value.alive);
    element.toggleClass('bg-danger', !value.alive);
    element.text(value.host);
    $(getBadge(value)).appendTo(element);
    collapse.text(`Time: ${value.time}, min: ${value.min}, max: ${value.max}, avg: ${value.avg}`);
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