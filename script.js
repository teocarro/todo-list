let listaDaCompletare = document.getElementById('listaDaCompletare');
let listaCompletati = document.getElementById('listaCompletati');
let inputDescrizione = document.getElementById("descrizioneTask");
let intestazioneData = document.getElementById("intestazioneData");
let inputData = document.getElementById("dataTask");
let pulsantiNelBody = document.querySelector("body");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let tasksCompletati = JSON.parse(localStorage.getItem("tasksCompletati")) || [];

let ordineDataCrescente = JSON.parse(localStorage.getItem("ordinamento"));

if (ordineDataCrescente === null){
    ordineDataCrescente = true;
}

class task{
    constructor(idt, data, descrizione){
        this.idt = idt;
        this.data = data;
        this.descrizione = descrizione;
    }
}

function salvaInLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("tasksCompletati", JSON.stringify(tasksCompletati));
    localStorage.setItem("ordinamento", JSON.stringify(ordineDataCrescente));
}

function aggiornaTestoOrdinamento(){

    if (ordineDataCrescente){
        intestazioneData.textContent = "DATA / Ordinamento: dal più recente";
    } else {
        intestazioneData.textContent = "DATA / Ordinamento: dal più remoto";
    }

}

function ordina(){

    if (ordineDataCrescente){
        tasks.sort((a, b) => a.data.localeCompare(b.data));
    } else {
        tasks.sort((a, b) => b.data.localeCompare(a.data));
    }

}

function aggiornaDaCompletare(){

    listaDaCompletare.innerHTML = "";

    for (let i = 0; i < tasks.length; i++){

        let righe = document.createElement("li");
        let elimina = document.createElement("button");
        let conferma = document.createElement("button");

        conferma.textContent = "conferma";
        conferma.className = "conferma";
        conferma.value = tasks[i].idt;

        elimina.textContent = "elimina";
        elimina.className = "elimina";
        elimina.value = tasks[i].idt;

        righe.innerHTML = `
            <span class="dataTask">${tasks[i].data}</span>
            <span class="descrizioneTask">${tasks[i].descrizione}</span>
        `;

        righe.appendChild(elimina);
        righe.appendChild(conferma);

        listaDaCompletare.appendChild(righe);
    }
}

function aggiornaCompletati(){

    listaCompletati.innerHTML = "";

    for (let i = 0; i < tasksCompletati.length; i++){

        let righe = document.createElement("li");
        let svuota = document.createElement("button");

        svuota.textContent = "svuota";
        svuota.className = "svuota";
        svuota.value = tasksCompletati[i].idt;

        righe.innerHTML = `
        <span class="dataTask">${tasksCompletati[i].data}</span>
        <span class="descrizioneTask">${tasksCompletati[i].descrizione}</span>
    `;

        righe.appendChild(svuota);

        listaCompletati.appendChild(righe);
    }
}

ordina();
aggiornaDaCompletare();
aggiornaCompletati();
aggiornaTestoOrdinamento();

const pulsanteAggiungi = document.getElementById("pulsanteAggiungi");

pulsanteAggiungi.addEventListener('click', ()=>{

    let data = new Date();

    let giorno = data.getDate();
    let mese = data.getMonth() + 1;
    let anno = data.getFullYear();
    let ora = data.getHours();
    let minuti = data.getMinutes();
    let secondi = data.getSeconds();
    let mSecondi = data.getMilliseconds();

    let idt = `${giorno}${mese}${anno}${ora}${minuti}${secondi}${mSecondi}`;

    let dataTask = inputData.value;
    let descrizioneTask = inputDescrizione.value;

    if (descrizioneTask != ''){

        let newTask = new task(idt, dataTask, descrizioneTask);

        tasks.push(newTask);

        ordina();
        salvaInLocalStorage();
        aggiornaDaCompletare();

        inputDescrizione.value = "";
        inputData.value = "";

    } else {

        alert('Almeno la descrizione deve essere valorizzata');

    }

});

pulsantiNelBody.addEventListener("click", (e)=>{

    switch (e.target.className){

        case "elimina":{

            let idtEntita = e.target.value;
            let nuovoArrayTemporaneo = [];

            for (let i = 0; i < tasks.length; i++){

                if (idtEntita != tasks[i].idt){
                    nuovoArrayTemporaneo.push(tasks[i]);
                }

            }

            tasks = nuovoArrayTemporaneo;

            salvaInLocalStorage();
            aggiornaDaCompletare();

        break;
        }

        case "conferma":{

            let idtEntitaConfermata = e.target.value;
            let nuovoArrayTemporaneo = [];

            for (let i = 0; i < tasks.length; i++){

                if (idtEntitaConfermata != tasks[i].idt){
                    nuovoArrayTemporaneo.push(tasks[i]);
                } else {
                    tasksCompletati.push(tasks[i]);
                }

            }

            tasks = nuovoArrayTemporaneo;

            salvaInLocalStorage();
            aggiornaDaCompletare();
            aggiornaCompletati();

        break;
        }

        case "svuota":{

            let idtEntita = e.target.value;
            let nuovoArrayTemporaneo = [];

            for (let i = 0; i < tasksCompletati.length; i++){

                if (idtEntita != tasksCompletati[i].idt){
                    nuovoArrayTemporaneo.push(tasksCompletati[i]);
                }

            }

            tasksCompletati = nuovoArrayTemporaneo;

            salvaInLocalStorage();
            aggiornaCompletati();

        break;
        }

    }

    switch (e.target.id){

        case "intestazioneData":

            ordineDataCrescente = !ordineDataCrescente;

            ordina();

            salvaInLocalStorage();
            aggiornaDaCompletare();
            aggiornaTestoOrdinamento();

        break;

    }

});