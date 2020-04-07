$(document).ready(function () {

    $.ajax({
        url: 'http://157.230.17.132:4011/sales',
        method: 'GET',
        success: function (data) {

            var object = { // Creazione Oggetto che popoleremo con i contenuti della chiamata Ajax
                gennaio: 0,
                febbraio: 0,
                marzo: 0,
                aprile: 0,
                maggio: 0,
                giugno: 0,
                luglio: 0,
                agosto: 0,
                settembre: 0,
                ottobre: 0,
                novembre: 0,
                dicembre: 0,
            };

            addMonthAmout(data, object);
            createLineChart('#chart', createLabels(object), createData(object));

        },
        error: function (err) {
            alert('errore API');
        }
    });

    function addMonthAmout(array, object) { // Funzione che con un array e un oggetto in entrata aggiunge l'ammontare ad ogni mese corrispondente
        for (var i = 0; i < array.length; i++) {
            var iObject = array[i];
            var iObjectDate = iObject.date;
            var dateIt = moment(iObjectDate, 'DD MM YYYY');
            var month = dateIt.format('MMMM');
            object[month] += iObject.amount;
        }
    };

    function createLabels(object) { // Funzione che crea un array labels
        var labels = [];
        for (var key in object) {
            labels.push(key);
        };
        return labels;
    };

    function createData(object) { // Funzione che crea un array data
        var data = [];
        for (var key in object) {
            data.push(object[key]);
        };
        return data;
    };

    function createLineChart(id, labels, data) { // Funzione che crea un grafico tipo line dato un id di destinazione e due array labels e data
        var ctx = $(id);
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendite Mensili',
                    borderColor: 'darkblue',
                    lineTension: 0,
                    data: data
                }]
            }
        });
    };

});
