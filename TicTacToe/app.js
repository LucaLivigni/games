window.addEventListener('load', ()=>{
    getItalia();
    getItaliaDetails();
});

//Selector
const landSelected = document.querySelector('.map-container');

//Event Listener
landSelected.addEventListener('click', showLandInfo);

//Functions
function getItalia(){
    var totale = 0;
    const totaleSomministrazioni = document.querySelector('.totale-somministrazioni');
    const nome = document.querySelector('.nome');

    const api = 'https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json';

    //Fetch Totale sommnistrazioni e nome
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(dati => {
            //console.log(dati);

            //Calcolo il totale di somministrazioni in Italia
            dati.data.forEach(function (entry) {
                totale += entry.dosi_somministrate;
            })

            //Set DOM Element from API
            totaleSomministrazioni.textContent = numberWithCommas(totale);
            nome.textContent = "Italia";
        })
}
function getItaliaDetails(){
    var totaleSessoM = 0;
    var totaleSessoF = 0;
    var totalePrimaDose = 0;
    var totaleSecondaDose = 0;

    const sessoM = document.querySelector('.sesso-maschile');
    const sessoF = document.querySelector('.sesso-femminile');
    const primaDose = document.querySelector('.prima-dose');
    const secondaDose = document.querySelector('.seconda-dose');


    const totaleGiornaliero = document.querySelector('.totaleGiornaliero');

    const api = 'https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.json';

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(dati => {
            console.log(dati);
            dati.data.forEach(function (entry){
                if(entry.data_somministrazione == getToday()){
                    totaleSessoM += entry.sesso_maschile;
                    totaleSessoF += entry.sesso_femminile;
                    totalePrimaDose += entry.prima_dose;
                    totaleSecondaDose += entry.seconda_dose
                }
            })

            sessoM.textContent = '+' + numberWithCommas(totaleSessoM);
            sessoF.textContent = '+' + numberWithCommas(totaleSessoF);
            primaDose.textContent = '+' + numberWithCommas(totalePrimaDose);
            secondaDose.textContent = '+' + numberWithCommas(totaleSecondaDose);

            totaleGiornaliero.textContent = "+" + numberWithCommas(totaleSessoM + totaleSessoF);
        })
}
function showLandInfo(e){
    //Prevent form from submitting
    e.preventDefault()

    //Controllo se ci sono land selezionate
    var selected = document.querySelector(".selected");
    if(selected != null){
        selected.classList.remove("selected");
    }

    const item = e.target;
    console.log(item.getAttribute('title'));
    let nomeRegione = item.getAttribute('title');

    //Coloro la regione
    item.classList.add('selected');

    if(nomeRegione == 'Trentino-Alto Adige'){
        setRegione('Provincia Autonoma Trento');

    } else if(nomeRegione == 'Valle d\'Aosta'){
        setRegione('Valle d\'Aosta \/ Vall\u00e9e d\'Aoste');
    } else if(nomeRegione == null){
        getItalia();
        getItaliaDetails();
    } else {
        setRegione(nomeRegione);
        setDetails(nomeRegione);
    }
}
//Formatto il numero con i punti di separazione
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function setRegione(nomeRegione){
    const totaleSomministrazioni = document.querySelector('.totale-somministrazioni');
    const nome = document.querySelector('.nome');

    const api = 'https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json';

    //Fetch Totale sommnistrazioni e nome
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(dati => {
            //console.log(dati);

            //Calcolo il totale di somministrazioni in Italia
            dati.data.forEach(function (entry) {
                if(entry.nome_area == nomeRegione){
                    //Set DOM Element from API
                    totaleSomministrazioni.textContent = numberWithCommas(entry.dosi_somministrate);
                    nome.textContent = entry.nome_area;
                }
            })
        })
}

function setDetails(nomeRegione){
    const sessoM = document.querySelector('.sesso-maschile');
    const sessoF = document.querySelector('.sesso-femminile');
    const primaDose = document.querySelector('.prima-dose');
    const secondaDose = document.querySelector('.seconda-dose');

    const totaleGiornaliero = document.querySelector('.totaleGiornaliero');

    const api = 'https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.json';

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(dati => {
            //console.log(dati);
            dati.data.forEach(function (entry){
                if(entry.data_somministrazione == getToday() && nomeRegione == entry.nome_area){
                    sessoM.textContent = '+' + numberWithCommas(entry.sesso_maschile);
                    sessoF.textContent = '+' + numberWithCommas(entry.sesso_femminile);
                    primaDose.textContent = '+' + numberWithCommas(entry.prima_dose);
                    secondaDose.textContent = '+' + numberWithCommas(entry.seconda_dose);

                    totaleGiornaliero.textContent = "+" + numberWithCommas(entry.totale);
                }
            })
        })
}

function getToday(){
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd + "T00:00:00.000Z";
    return today;
}