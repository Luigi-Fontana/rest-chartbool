$(document).ready(function () {

    apiCallGet();

    $('#submit').click(function () { // Al click del bottone
        var selSalesman = $('#sel-salesman').val(); // Assegno a variabili i valori dei campi del form
        var selDD = $('.dd').val();
        var selMM = $('.mm').val();
        var selYYYY = $('.yyyy').val();
        var selDate = selDD + '/' + selMM + '/' + selYYYY; // Creo una data compatibile con quelle dell'API
        var selAmount = parseInt($('#input-amount').val());
        var selData = { // Creo un oggetto con i valori dei campi del form
            salesman: selSalesman,
            amount: selAmount,
            date: selDate
        };
        $.ajax({ // Chiamata Post con data in ingresso l'oggetto appena creato
            url: 'http://157.230.17.132:4011/sales',
            method: 'POST',
            data: selData,
            success: function (data) {
                apiCallGet(); // All'interno rievoco la funzione per la chiamata GET per aggiornare i grafici
            },
            error: function (err) {
                alert('Error');
            }
        });
        $('#sel-salesman').val(''); // Resetto tutti i campi del form
        $('.dd').val('');
        $('.mm').val('');
        $('#input-amount').val('');
    });

    function apiCallGet() {
        $.ajax({
            url: 'http://157.230.17.132:4011/sales',
            method: 'GET',
            success: function (data) {

                var objectMonth = { // Creazione Oggetto con i mesi che popoleremo con i contenuti della chiamata Ajax
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
                var objectSalesman = {}; // Creazione oggetto che popoleremo con i salesman e i rispettivi amount

                var arrayAmount = []; // Creazione Array vuoto che popoleremo con gli amount generici
                addArrayAmount(data, arrayAmount); // Funzione per la popolazione dell'arrayAmount

                var totalAmount = arrayAmount.reduce(function(a, b){ // Creazione variabile con la somma di tutti i valori dell'arrayAmount
                    return a + b;
                }, 0);

                addMonthAmount(data, objectMonth); // Richiamo funzione per popolamento objectMonth
                addSalesmanAmount(data, objectSalesman); // Richiamo funzione per popolamento objectSalesman
                createLineChart('#line-chart', createLabels(objectMonth), createData(objectMonth)); // Richiamo funzione per generazione Grafico Line
                createPieChart('#pie-chart', createLabels(objectSalesman), createDataPerc(objectSalesman, totalAmount)); // Richiamo funzione per generazione Grafico Pie

            },
            error: function (err) {
                alert('errore API');
            }
        });
    };

    function addArrayAmount(arrayData, array) { // Funziona che con un array e un oggetto in entrata aggiunge l'amount all'array di base
        for (var i = 0; i < arrayData.length; i++) {
            var iObject = arrayData[i];
            array.push(parseInt(iObject.amount));
        }
    };

    function addMonthAmount(array, object) { // Funzione che con un array e un oggetto in entrata aggiunge l'amount ad ogni mese corrispondente
        for (var i = 0; i < array.length; i++) {
            var iObject = array[i];
            var iObjectDate = iObject.date;
            var dateIt = moment(iObjectDate, 'DD MM YYYY');
            var month = dateIt.format('MMMM');
            object[month] += parseInt(iObject.amount);
        }
    };

    function addSalesmanAmount(array, object) { // Funzione che con un array e un oggetto in entrata aggiunge l'amount ad ogni salesman corrispondente
        for (var i = 0; i < array.length; i++) {
            var iObject = array[i];
            var salesman = iObject.salesman;
            if (object[salesman] === undefined) {
                object[salesman] = 0;
            }
            object[salesman] += parseInt(iObject.amount);
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

    function createDataPerc(object, total) { // Funzione che crea un array data con valori percentuali in base a un totale
        var data = [];
        for (var key in object) {
            data.push(Math.round((object[key] / total) * 100));
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

    function createPieChart(id, labels, data) { // Funzione che crea un grafico tipo pie dato un id di destinazione e due array labels e data
        var ctx = $(id);
        var chart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'pink',
                        'orange',
                        'lightblue',
                        'lightgreen'
                    ]
                }],
                labels: labels
            }
        });
    };

});
