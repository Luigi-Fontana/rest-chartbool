$(document).ready(function () {

    $.ajax({
        url: 'http://157.230.17.132:4011/sales',
        method: 'GET',
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            alert('errore API');
        }
    });

});
