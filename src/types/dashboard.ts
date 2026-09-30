export interface FuoriClasse {
    /** Operazione */
    operazione: string;
    /** Data in cui è accaduto il fuori classe (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Descrizione del fuori classe */
    descrizione: string;
    /** Data in cui è accaduto il fuori classe (YYYY-MM-DD) */
    data: string;
    /** Docente che ha registrato l'evento */
    docente: string;
    /** Eventuale nota dell'evento */
    nota: string;
    /** Indica se si sta seguendo la lezione da remoto o no (utile nel periodo di DAD) */
    frequenzaOnLine: boolean;
}

export interface MateriaInfo {
    /** Abbreviazione della materia @example "STO/GEO" */
    abbreviazione: string;
    /** Fa parte dello scrutinio o no (?) */
    scrut: boolean;
    /** Dato sconosciuto */
    codTipo: string;
    /** Fa media o no */
    faMedia: boolean;
    /** Nome completo della materia @example "STORIA E GEOGRAFIA" */
    materia: string;
    /** Codice di identificazione della materia */
    pk: string;
}

export interface Periodo {
    /** Codice di identificazione del periodo */
    pkPeriodo: string;
    /** Data di inizio del periodo (DD/MM/YYYY) */
    dataInizio: string;
    /** Descrizione (nome) */
    descrizione: string;
    /** Data di inizio del periodo (YYYY-MM-DD) */
    datInizio: string;
    /** Voto unico */
    votoUnico: boolean;
    /** Media dello scrutinio */
    mediaScrutinio: number;
    /** isMediaScrutinio */
    isMediaScrutinio: boolean;
    /** Data di fine del periodo (DD/MM/YYYY) */
    dataFine: string;
    /** Data di fine del periodo (YYYY-MM-DD) */
    datFine: string;
    /** Codice del periodo @example "1Q" */
    codPeriodo: string;
    /** Indica se è lo scrutinio finale o no */
    scrutFinale: boolean;
}

export interface Promemoria {
    /** Data in cui è stato inserito il promemoria (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Descrizione del promemoria */
    desAnnotazioni: string;
    /** Codice di identificazione del docente */
    pkDocente: string;
    /** Visibile alla famiglia, magari è `si` o `no` */
    flgVisibileFamiglia: string;
    /** Giorno in cui è accaduto il promemoria (YYYY-MM-DD) */
    datGiorno: string;
    /** Nome docente */
    docente: string;
    /** Non documentato */
    oraInizio: string;
    /** Non documentato */
    oraFine: string;
}

export interface BachecaAllegato {
    /** Nome del file */
    nomeFile: string;
    /** Path del file */
    path: string;
    /** Descrizione del file, se non è presente è `null` */
    descrizione: string | null;
    /** Codice di identificazione del file */
    pk: string;
    /** URL del file */
    url: string;
}

export interface BachecaItem {
    /** Data in cui è stato inserito il documento (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Messaggio (titolo) del documento */
    messaggio: string;
    /** Data in cui è stato inserito il documento (YYYY-MM-DD) */
    data: string;
    /** Presa visione richiesta */
    pvRichiesta: boolean;
    /** Categoria del documento */
    categoria: string;
    /** Data conferma presa visione (YYYY-MM-DD), stringa vuota se non confermata */
    dataConfermaPresaVisione: string;
    /** Sconosciuto. */
    url: string;
    /** Autore del documento */
    autore: string;
    /** Data di scadenza (YYYY-MM-DD), `null` se assente */
    dataScadenza: string | null;
    /** Operazione */
    operazione: string;
    /** Presa adesione richiesta */
    adRichiesta: boolean;
    /** Presa visione confermata */
    isPresaVisione: boolean;
    /** Data conferma presa adesione (YYYY-MM-DD), stringa vuota se non confermata */
    dataConfermaPresaAdesione: string;
    /** Codice di identificazione del documento */
    pk: string;
    /** Lista di allegati del documento */
    allegati: BachecaAllegato[];
    /** Data di scadenza dell'adesione (YYYY-MM-DD), `null` se assente */
    dataScadenzaAdesione: string | null;
    /** Presa adesione confermata */
    isPresaAdesione: boolean;
}

export interface FileCondivisi {
    fileAlunniScollegati: unknown[];
    fileAlunniCollegati: unknown[];
}

export interface MateriaLight {
    scuMateriaPK: {
        /** Codice della scuola */
        codMin: string;
        /** Sconosciuto */
        prgScuola: number;
        /** Anno corrente (YYYY) */
        annoScolastico: number;
        /** Sconosciuto */
        prgMateria: number;
    };
    /** Codice materia */
    codMateria: string;
    /** Nome della materia */
    desDescrizione: string;
    /** Nome abbreviato della materia */
    desDescrAbbrev: string;
    /** Codice suddivisione (?) */
    codSuddivisione: string;
    /** Sconosciuto */
    codTipo: string;
    /** Fa parte della media o no (`S` o `N`) */
    flgConcorreMedia: string;
    /** Sconosciuto */
    codAggrDisciplina: unknown;
    /** Indica se il voto è una lezione individuale o no */
    flgLezioniIndividuali: unknown;
    /** Codice ministeriale */
    codMinistreriale: string;
    /** Icona della materia */
    icona: string;
    /** Descrizione della materia */
    descrizione: string;
    /** Contiene insufficienze */
    conInsufficienze: boolean;
    /** Selezionata (?) */
    selezionata: boolean;
    /** Utilizzato per la UI */
    tipoOnGrid: string; // "(Materia)"
    /** Sconosciuto */
    prgMateria: number;
    /** Tipo di materia (es. "Lingua Straniera", "Normale") */
    tipo: string;
    /** Su cosa si basa la materia (Orale, Scritta, ecc.) */
    articolata: string;
    /** Se la materia si basa su lezioni individuali o no */
    lezioniIndividuali: boolean;
    /** Id della materia */
    idmateria: string;
    /** Descrizione materia */
    codEDescrizioneMateria: string;
}

export interface Voto {
    /** Data in cui è stato inserito il voto (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Codice di identificazione del periodo */
    pkPeriodo: string;
    /** Voto (in una stringa) */
    codCodice: string;
    /** Voto (in un numero) */
    valore: number;
    /** Codice voto pratico (?) */
    codVotoPratico: string;
    /** Nome del docente */
    docente: string;
    /** Codice di identificazione della materia del voto */
    pkMateria: string;
    /** Tipo di valutazione (sconosciuto al momento) */
    tipoValutazione: unknown;
    /** Sconosciuto */
    prgVoto: number;
    /** Operazione */
    operazione: string;
    /** Descrizione della prova */
    descrizioneProva: string;
    /** Può contenere informazioni come se il voto fa media o no */
    faMenoMedia: string;
    /** Codice di identificazione del docente */
    pkDocente: string;
    /** Voto scritto a parole (es. sette invece di 7) */
    descrizioneVoto: string;
    /** Sconosciuto */
    codTipo: string;
    /** Data in cui è stato inserito il voto (YYYY-MM-DD) */
    datGiorno: string;
    /** Numero del mese dell'anno in cui è stato inserito il voto */
    mese: number;
    /** Numero media (?) */
    numMedia: number;
    /** Codice di identificazione del voto */
    pk: string;
    /** Nome materia */
    desMateria: string;
    /** Variante "light" della materia */
    materiaLight: MateriaLight;
    /** Descrizione del voto */
    desCommento: string;
}

export interface DocenteClasse {
    /** Cognome del docente */
    desCognome: string;
    /** Array di materie insegnate dal docente (nome) */
    materie: string[];
    /** Nome del docente */
    desNome: string;
    /** Codice di identificazione del docente */
    pk: string;
    /** Email del docente */
    desEmail: string;
}

export interface BachecaAlunnoItem {
    /** Nome del file */
    nomeFile: string;
    /** Data in cui è stato inserito il documento (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Messaggio del documento */
    messaggio: string;
    /** URL di download per il genitore */
    flgDownloadGenitore: string;
    /** Presa visione */
    isPresaVisione: boolean;
    /** Codice di identificazione del documento */
    pk: string;
}

export interface MediaPeriodo {
    /** Media generale */
    mediaGenerale: number;
    /** Lista materie, non documentato */
    listaMaterie: unknown;
    /** Media per ogni mese */
    mediaPerMese: Record<string, number>;
}

export interface MediaMateria {
    /** Somma valutazioni orali */
    sommaValutazioniOrale: number;
    /** Numero di valutazioni orali */
    numValutazioniOrale: number;
    /** Media totale della materia */
    mediaTotale: number;
    /** Media scritta della materia */
    mediaScritta: number;
    /** Somma valori (?) */
    sumValori: number;
    /** Numero valori (?) */
    numValori: number;
    /** Numero voti */
    numVoti: number;
    /** Numero valutazioni scritte */
    numValutazioniScritto: number;
    /** Somma valutazioni scritte */
    sommaValutazioniScritto: number;
    /** Media orale */
    mediaOrale: number;
}

export interface Compito {
    /** Il compito in sè */
    compito: string;
    /** Data di consegna del compito (YYYY-MM-DD) */
    dataConsegna: string;
}

export interface RegistroEntry {
    /** Operazione */
    operazione: string;
    /** Data in cui è stato inserito il registro (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Url (sconosciuto) */
    desUrl: string;
    /** Codice di identificazione del docente */
    pkDocente: string;
    /** Compiti */
    compiti: Compito[];
    /** Data in cui è stato inserito il registro (YYYY-MM-DD) */
    datGiorno: string;
    /** Nome del docente */
    docente: string;
    /** Nome della materia */
    materia: string;
    /** Codice di identificazione del registro */
    pk: string;
    /** Codice di identificazione della materia */
    pkMateria: string;
    /** Attività svolta in classe */
    attivita: string;
    /** Ora scolastica (1,2,3,4,5,6...) */
    ora: number;
}

export interface AppelloEvento {
    /** Operazione */
    operazione: string;
    /** Data in cui è stato inserito l'appello (in formato YYYY-MM-DD HH:mm:ss) */
    datEvento: string;
    /** Descrizione dell'appello */
    descrizione: string;
    /** Da giustificare */
    daGiustificare: boolean;
    /** Giustificata (S/N) */
    giustificata: string;
    /** Data in cui è stato inserito l'appello (YYYY-MM-DD) */
    data: string;
    /** Codice evento */
    codEvento: string;
    /** Nome del docente */
    docente: string;
    /** Commento della giustifica */
    commentoGiustificazione: string;
    /** Codice di identificazione dell'evento */
    pk: string;
    /** Data di giustificazione (YYYY-MM-DD || "") */
    dataGiustificazione: string;
    /** Nota dell'evento */
    nota: string;
}

export interface DashboardOpzione {
    chiave: string;
    valore: boolean;
}

export interface DashboardData {
    /** Tutti i fuori classe avvenuti durante l'anno scolastico */
    fuoriClasse: FuoriClasse[];
    /** Dato sconosciuto */
    msg: string;
    /** Eco delle opzioni inviate (lista di 44 nel MITM 2026-09-28) */
    opzioni?: DashboardOpzione[];
    /** Media generale */
    mediaGenerale: number;
    /** Media aritmetica di ogni mese */
    mediaPerMese: Record<string, number>;
    listaMaterie: MateriaInfo[];
    /** Opzione del client mobile, serve per rimuovere i dati locali e riscaricarli */
    rimuoviDatiLocali: boolean;
    /** Lista dei periodi dell'anno (Primo quadrimestre, Secondo quadrimestre, ecc...) */
    listaPeriodi: Periodo[];
    /** Promemoria */
    promemoria: Promemoria[];
    /** Documenti della bacheca */
    bacheca: BachecaItem[];
    /** File condivisi tra docenti e famiglia */
    fileCondivisi: FileCondivisi;
    /** Voti */
    voti: Voto[];
    /** Flag client side, serve molto probabilmente per richiedere un fetch completo della dashboard */
    ricaricaDati: boolean;
    /** Lista di docenti della classe */
    listaDocentiClasse: DocenteClasse[];
    /** Bacheca alunno */
    bachecaAlunno: BachecaAlunnoItem[];
    /** Profilo disabilitato */
    profiloDisabilitato: boolean;
    /** Media per periodo */
    mediaPerPeriodo: Record<string, MediaPeriodo>;
    /** Media di ogni materia */
    mediaMaterie: Record<string, MediaMateria>;
    /** Autocertificazione - non documentato (assente nelle risposte delta) */
    autocertificazione?: unknown;
    /** Registro, in `getDashboard(data)` è il delta (solo novità); in full è completo */
    registro: RegistroEntry[];
    /** Schede - non documentato (assente nelle risposte delta) */
    schede?: unknown;
    /** Prenotazioni alunni - non documentato */
    prenotazioniAlunni: unknown;
    /** Note disciplinari - non documentato */
    noteDisciplinari: unknown;
    /** Codice identificativo dell'utente */
    pk: string;
    /** Eventi dell'appello */
    appello: AppelloEvento[];
    /** Indica se l'utente ha classi extra o no (assente nelle risposte delta) */
    classiExtra?: boolean;
}

export interface APIDashboard {
    dati: DashboardData[];
}

export interface WhatAlunno {
    isUltimaClasse: boolean;
    nominativo: string;
    cognome: string;
    nome: string;
    pk: string;
    maggiorenne: boolean;
    desEmail: string;
}

export interface WhatScheda {
    aggiornaSchedaPK: boolean;
    classe: {
        pk: string;
        desDenominazione: string;
        desSezione: string;
    };
    dataInizio: string;
    anno: number;
    corso: {
        descrizione: string;
        pk: string;
    };
    sede: {
        descrizione: string;
        pk: string;
    };
    scuola: {
        desOrdine: string;
        descrizione: string;
        pk: string;
    };
    dataFine: string;
    pk: string;
}

/**
 * Singolo elemento di `APIWhat.dati` (endpoint `/dashboard/what`).
 * Quando non ci sono modifiche i campi delta restano assenti e
 * `differenzaSchede` è `false`; in caso di variazioni il server
 * aggiunge le sezioni modificate (voti, registro, ...).
 */
export interface WhatDati {
    forceLogin: boolean;
    isModificato: boolean;
    pk: string;
    alunno: WhatAlunno;
    mostraPallino: boolean;
    scheda: WhatScheda;
    differenzaSchede: unknown;
    profiloStorico: boolean;
    /** Sezioni delta presenti solo quando modificate. */
    [deltaSection: string]: unknown;
}

export interface APIWhat {
    dati: WhatDati[];
}

/** Input accettato da `getWhat()`: Date oppure stringa già formattata (es. con microsecondi). */
export type WhatDateInput = Date | string;

export interface GetWhatOptions {
    /**
     * Opzioni dashboard; default = stesse di `getDashboard()`.
     * Accetta oggetto (viene serializzato) o stringa già serializzata.
     */
    opzioni?: Record<string, boolean> | string;
    /**
     * Tutti i mobile token dell'account per `lista-x-auth-token-account`.
     * Default: token cachati da `getProfili()` oppure `[selectedToken]`.
     */
    accountTokens?: string[];
}
