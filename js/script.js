const Io = io('http://localhost:81');
let selectedBtn = null;

Io.on('getHosts', value => {
    const tmp = $('#computers');
    tmp.empty();

    value.forEach((host) => {
        let bg = null;

        if ((host[2] && selectedBtn == false) || (!host[2] && selectedBtn == true)) {
            return;
        }

        if (host[2]) {
            bg = "bg-success";
        } else {
            bg = "bg-danger";
        }

        tmp.append('<li class="list-group-item ' + bg + '">' + host[0] + ' - time: ' + host[3] + ', min: ' + host[4] + ', max: ' + host[5] + ', avg: ' + host[6] +'<span class="float-right badge badge-primary badge-pill">' + host[1] + '</span></li>')
    });
});

const btnAll = $('#all');
const btnActive = $('#active');
const btnInactive = $('#inactive');

btnAll.click(() => {
    selectedBtn = null;
    
    if (!btnAll.hasClass('active')) {
        btnAll.addClass('active');
    }

    btnActive.removeClass('active');
    btnInactive.removeClass('active');
});

btnActive.click(() => {
    selectedBtn = true;

    if (!btnActive.hasClass('active')) {
        btnActive.addClass('active');
    }

    btnAll.removeClass('active');
    btnInactive.removeClass('active');
});

btnInactive.click(() => {
    selectedBtn = false;

    if (!btnInactive.hasClass('active')) {
        btnInactive.addClass('active');
    }

    btnActive.removeClass('active');
    btnAll.removeClass('active');
});