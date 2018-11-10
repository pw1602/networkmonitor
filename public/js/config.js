'use strict';

const GET_COMPUTERS_API_URL = `http://${window.location.host}/api/computers`;
const GET_COMPUTER_API_URL = `http://${window.location.host}/api/computers/`;

const addComputer = $('#addComputer');
const deleteComputer = $('#deleteComputer');
const renameComputer = $('#renameComputer');

addComputer.submit(e => {
    e.preventDefault();

    const formData = toJSON(addComputer.serializeArray());
    $.ajax({
        url: GET_COMPUTER_API_URL + formData.name,
        type: 'GET',
    })
    .done(res => {
        if (res.length != 0) {
            growlMsg('warning', 'Dodawanie komputera', 'Komputer o tej nazwie już istnieje!', 'plus');
            return;
        }

        $.ajax({
            url: GET_COMPUTER_API_URL + formData.host,
            type: 'GET',
        })
        .done(res => {
            if (res.length != 0) {
                growlMsg('warning', 'Dodawanie komputera', 'Komputer o tym ip/hoście już istnieje!', 'plus');
                return;
            }
    
            $.ajax({
                url: GET_COMPUTERS_API_URL,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData)
            })
            .done(res => {
                if (res.affectedRows != 0) {
                    growlMsg('success', 'Dodawanie komputera', 'Dodano komputer!', 'plus');
                    formData.id = res.insertId;
                    Io.emit('getHosts', 'add', formData);
                    addComputer.find('input').val('');
                } else {
                    growlMsg('danger', 'Dodawanie komputera', 'Nie udało się dodać komputera!', 'plus');
                }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

deleteComputer.submit(e => {
    e.preventDefault();

    const formData = toJSON(deleteComputer.serializeArray());
    $.ajax({
        url: GET_COMPUTER_API_URL + formData.host,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formData)
    })
    .done(res => {
        if (res.affectedRows != 0) {
            growlMsg('success', 'Usuwanie komputera', 'Usunięto komputer!', 'minus');
            Io.emit('getHosts', 'delete', formData);
            deleteComputer.find('input').val('');
        } else {
            growlMsg('warning', 'Usuwanie komputera', 'Nie ma takiego komputera!', 'minus');
        }
    })
    .catch(err => console.log(err));
});

renameComputer.submit(e => {
    e.preventDefault();

    const formData = toJSON(renameComputer.serializeArray());

    $.ajax({
        url: GET_COMPUTER_API_URL + formData.newName,
        type: 'GET'
    })
    .done(res => {
        if (res.length != 0) {
            growlMsg('warning', 'Zmiana nazwy komputera', 'Już istnieje komputer o takiej nazwie!', 'transfer');
            return;
        }
        
        $.ajax({
            url: GET_COMPUTER_API_URL + formData.oldName,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData)
        })
        .done(res => {
            if (res.affectedRows != 0) {
                growlMsg('success', 'Zmiana nazwy komputera', 'Zmieniono nazwę komputera!', 'transfer');
                Io.emit('getHosts', 'change', formData);
                renameComputer.find('input').val('');
            } else {
                growlMsg('warning', 'Zmiana nazwy komputera', 'Nie ma takiego komputera!', 'transfer');
            }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

function toJSON(form) {
    let obj = {};

    for (let i = 0; i < form.length; i++) {
        let name = form[i].name;
        let value = form[i].value;

        if (name) {
            obj[name] = value;
        }
    }

    return obj;
}