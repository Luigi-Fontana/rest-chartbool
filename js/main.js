$(document).ready(function () {

    var baseUrl = 'http://157.230.17.132:4011/sales';
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
            url: baseUrl,
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
            url: baseUrl,
            method: 'GET',
            success: function (data) {
                var objectMonth = objectMonthBuilder(data); // Assegno a una variabile la funzione che restituisce un oggetto per ricavare in seguito i valori delle chiavi
                createLineChart('#line-chart', objectMonth.labels, objectMonth.data);
                var totalAmount = totalAmountBuilder(data); // Assegno a una variabile la funzione di costruzione Amount totale per usarla nella successiva funzione
                var objectSalesman = objectSalesmanBuilder(data, totalAmount);
                createPieChart('#pie-chart', objectSalesman.labels, objectSalesman.data);

            },
            error: function (err) {
                alert('errore API');
            }
        });
    };

    function totalAmountBuilder(array) { // Funzione che con un array in entrata ritorna una variabile con valore l'Amount Totale
        var totalAmount = 0;
        for (var i = 0; i < array.length; i++) {
            var iObject = array[i];
            totalAmount += parseInt(iObject.amount);
        }
        return totalAmount;
    }

    function objectMonthBuilder(array) { // Funzione che con un array in entrata crea un oggetto per ritornare due array con mesi e vendite
        var objectMonth = { // Creazione oggetto con chiavi già fissate
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
        for (var i = 0; i < array.length; i++) { // Ciclo sull'array GET per aggiungere a ogni mese dell'oggetto l'amount corrispondente
            var iObject = array[i];
            var iObjectDate = iObject.date;
            var month = moment(iObjectDate, 'DD/MM/YYYY').format('MMMM');
            objectMonth[month] += parseInt(iObject.amount);
        }
        var arrayLabels = []; // Inizializzo i due Array da utilizzare in Chart.js
        var arrayData = [];
        for (var key in objectMonth) { // Ciclo all'interno dell'oggetto per trasformare la coppia chiave-valore in due array da dare a Chart.js
            arrayLabels.push(key); // Inserisco il nome del mese nell'arrayLabels
            arrayData.push(objectMonth[key]); // Inserisco nell'arrayData la somma di tutte le vendite relative a quel mese
        }
        return {
            labels: arrayLabels,
            data: arrayData
        };
    };

    function objectSalesmanBuilder(array, totalAmount) { // Funzione che con un array in entrata crea un oggetto per ritornare due array con venditori e vendite
        var objectSalesman = {}; // Creazione oggetto vuoto
        for (var i = 0; i < array.length; i++) { // Ciclo sull'array GET per aggiungere i venditori all'oggetto e il rispettivo amount per ciascuno di essi
            var iObject = array[i];
            var salesman = iObject.salesman;
            if (objectSalesman[salesman] === undefined) {
                objectSalesman[salesman] = 0;
            }
            objectSalesman[salesman] += parseInt(iObject.amount);
        }
        var arrayLabels = []; // Inizializzo i due Array da utilizzare in Chart.js
        var arrayData = [];
        for (var key in objectSalesman) { // Ciclo all'interno dell'oggetto per trasformare la coppia chiave-valore in due array da dare a Chart.js
            arrayLabels.push(key); // Inserisco il nome del venditore nell'arrayLabels
            var salesmanAmountPerc = ((objectSalesman[key] / totalAmount) * 100).toFixed(2); // Assegno a una variabile il venduto in percentuale
            arrayData.push(salesmanAmountPerc); // Inserisco nell'arrayData la somma di tutte le vendite relative a quel venditore
        }
        return {
            labels: arrayLabels,
            data: arrayData
        };
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
                    backgroundColor: ['pink', 'orange', 'lightblue', 'lightgreen']
                }],
                labels: labels
            },
            options: {
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                  }
                }
            }
        });
    };

});
