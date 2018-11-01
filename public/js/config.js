'use strict';

$('#addComputer').submit(e => {
    e.preventDefault();

    const formData = toJSON($('#addComputer').serializeArray());
    $.ajax({
        url: 'http://localhost:3000/api/computers/' + formData.name,
        type: 'GET',
    })
    .done(res => {
        if (res.length != 0) {
            growlMsg('warning', 'Dodawanie komputera do bazy', 'Komputer o tej nazwie już istnieje!', 'plus');
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/api/computers/' + formData.host,
            type: 'GET',
        })
        .done(res => {
            if (res.length != 0) {
                growlMsg('warning', 'Dodawanie komputera do bazy', 'Komputer o tym ip/hoście już istnieje!', 'plus');
                return;
            }
    
            $.ajax({
                url: 'http://localhost:3000/api/computers',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData)
            })
            .done(res => {
                if (res.affectedRows != 0) {
                    growlMsg('success', 'Dodawanie komputera do bazy', 'Dodano komputer do bazy!', 'plus');
                    Io.emit('getHosts');
                } else {
                    growlMsg('danger', 'Dodawanie komputera do bazy', 'Nie udało się dodać komputera do bazy!', 'plus');
                }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

$('#deleteComputer').submit(e => {
    e.preventDefault();

    const formData = toJSON($('#deleteComputer').serializeArray());
    $.ajax({
        url: 'http://localhost:3000/api/computers/' + formData.host,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formData)
    })
    .done(res => {
        if (res.affectedRows != 0) {
            growlMsg('success', 'Usuwanie komputera z bazy', 'Usunięto komputer z bazy!', 'minus');
            Io.emit('getHosts');
        } else {
            growlMsg('warning', 'Usuwanie komputera z bazy', 'Nie ma takiego komputera w bazie!', 'minus');
        }
    })
    .catch(err => console.log(err));
});

$('#renameComputer').submit(e => {
    e.preventDefault();

    const formData = toJSON($('#renameComputer').serializeArray());
    $.ajax({
        url: 'http://localhost:3000/api/computers/' + formData.oldName,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData)
    })
    .done(res => {
        if (res.affectedRows != 0) {
            growlMsg('success', 'Zmiana nazwy komputera w bazie', 'Zmieniono nazwę komputera w bazie!', 'transfer');
            Io.emit('getHosts');
        } else {
            growlMsg('warning', 'Zmiana nazwy komputera w bazie', 'Nie ma takiego komputera w bazie!', 'transfer');
        }
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