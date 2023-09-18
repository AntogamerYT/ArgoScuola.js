export interface Token {
    access_token: string;
    expires_at: Date | undefined;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}



// Type di .well-known/openid-configuration
export interface OpenIDConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    jwks_uri: string;
    subject_types_supported: string[];
    response_types_supported: string[];
    claims_supported: string[];
    grant_types_supported: string[];
    response_modes_supported: string[];
    userinfo_endpoint: string;
    scopes_supported: string[];
    token_endpoint_auth_methods_supported: string[];
    userinfo_signing_alg_values_supported: string[];
    id_token_signing_alg_values_supported: string[];
    request_parameter_supported: boolean;
    request_uri_parameter_supported: boolean;
    require_request_uri_registration: boolean;
    claims_parameter_supported: boolean;
    revocation_endpoint: string;
    backchannel_logout_supported: boolean;
    backchannel_logout_session_supported: boolean;
    frontchannel_logout_supported: boolean;
    frontchannel_logout_session_supported: boolean;
    end_session_endpoint: string;
    request_object_signing_alg_values_supported: string[];
    code_challenge_methods_supported: string[];
}


export type ArgoClientOptions = {
    /**
     * Codice scuola
     */
    codScuola: string;
    /**
     * Username argo
     */
    username: string;
    /**
     * Password del profilo
     */
    password: string;
    /**
     * Percorso del file di configurazione da salvare (contiene access token e refresh token) (default: ./config.json)
     */
    configPath?: string;
    /**
     * Abilita log di debug (defaulta a false)
     */
    debug?: boolean;
};

export type HttpMethod =
    | "CONNECT"
    | "DELETE"
    | "GET"
    | "HEAD"
    | "OPTIONS"
    | "PATCH"
    | "POST"
    | "PUT"
    | "TRACE";

export const utilities = {
    baseApiURL: "https://www.portaleargo.it/appfamiglia/api/rest",
    clientId: "72fd6dea-d0ab-4bb9-8eaa-3ac24c84886c",
    scopes: "openid offline profile user.roles argo",
    callback: "it.argosoft.didup.famiglia.new://login-callback",
}

export interface APIDashboard {
    dati: [
        {
            /**
             * Indica tutti i fuori classe avvenuti durante l'anno scolastico
             */
            fuoriClasse: {
                /**
                 * Operazione
                 */
                operazione: string;
                /**
                 * Data in cui è accaduto il fuori classe (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Descrizione del fuori classe 
                 */
                descrizione: string;
                /**
                 * Data in cui è accaduto il fuori classe (YYYY-MM-DD)
                 */
                data: string;
                /**
                 * Docente che ha registrato l'evento
                 */
                docente: string;
                /**
                 * Eventuale nota dell'evento
                 */
                nota: string;
                /**
                 * Indica se si sta seguendo la lezione da remoto o no (utile nel periodo di DAD)
                 */
                frequenzaOnLine: boolean
            }[]
            /**
             * Dato sconosciuto
             */
            msg: string;
            /**
             * Media generale
             */
            mediaGenerale: number;
            /**
             * Media aritmetica di ogni mese
             */
            mediaPerMese: Record<string, number>;
            listaMaterie: {
                /**
                 * Abbreviazione della materia
                 * @example "STO/GEO"
                 */
                abbreviazione: string;
                /**
                * Fa parte dello scrutinio o no (?)
                */
                scrut: boolean;
                /**
                 * Dato sconosciuto
                 */
                codTipo: string;
                /**
                 * Fa media o no
                 */
                faMedia: boolean;
                /**
                 * Nome completo della materia
                 * @example "STORIA E GEOGRAFIA"
                 */
                materia: string;
                /**
                 * Codice di identificazione della materia
                 */
                pk: string;
            }[]
            /**
             * Opzione utilizzata dal client mobile di argo, serve per rimuovere i dati locali e riscaricarli ogni volta
             */
            rimuoviDatiLocali: boolean;
            /**
             * Lista dei periodi dell'anno (Primo quadrimestre, Secondo quadrimestre, ecc...)
             */
            listaPeriodi: {
                /**
                 * Codice di identificazione del periodo
                 */
                pkPeriodo: string;
                /**
                 * Data di inizio del periodo (DD/MM/YYYY)
                 */
                dataInizio: string;
                /**
                 * Descrizione (nome)
                 */
                descrizione: string;
                /**
                 * Data di inizio del periodo (YYYY-MM-DD)
                 */
                datInizio: string;
                /**
                 * Voto unico
                 */
                votoUnico: boolean;
                /**
                 * Media dello scrutinio
                 */
                mediaScrutinio: number;
                /**
                 * isMediaScrutinio (onestamente non so che cosa si fuma Argo per inventare queste proprietà inutili)
                 */
                isMediaScrutinio: boolean;
                /**
                 * Data di fine del periodo (DD/MM/YYYY)
                 */
                dataFine: string;
                /**
                 * Data di fine del periodo (YYYY-MM-DD)
                 */
                datFine: string;
                /**
                 * Codice del periodo (Molto probabilmente un'abbreviazione)
                 * @example "1Q"
                 */
                codPeriodo: string;
                /**
                 * Indica se è lo scrutinio finale o no
                 */
                scrutFinale: boolean;
            }[]
            /**
             * Promemoria (Alcuni dati della documentazione potrebbero essere errati)
             */
            promemoria: {
                /**
                 * Data in cui è stato inserito il promemoria (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Descrizione del promemoria
                 */
                desAnnotazioni: string;
                /**
                 * Codice di identificazione del docente
                 */
                pkDocente: string;
                /**
                 * Visibile alla famiglia, magari è `si` o `no`
                 */
                flgVisibileFamiglia: string;
                /**
                 * Giorno in cui è accaduto il promemoria (YYYY-MM-DD)
                 */
                datGiorno: string;
                /**
                 * Nome docente
                 */
                docente: string;
                /**
                 * Non documentato
                 */
                oraInizio: string;
                /**
                 * Non documentato
                 */
                oraFine: string;
            }[]
            /**
             * Documenti della bacheca
             */
            bacheca: {
                /**
                 * Data in cui è stato inserito il documento (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Messaggio (titolo) del documento
                 */
                messaggio: string;
                /**
                 * Data in cui è stato inserito il documento (YYYY-MM-DD)
                 */
                data: string;
                /**
                 * Presa visione richiesta
                 */
                pvRichiesta: boolean;
                /**
                 * Categoria del documento
                 */
                categoria: string;
                /**
                 * Data in cui è stata confermata la presa visione (YYYY-MM-DD), se non è stata confermata è una stringa vuota
                 */
                dataConfermaPresaVisione: string;
                /**
                 * Sconosciuto.
                 */
                url: string;
                /**
                 * Autore del documento
                 */
                autore: string;
                /**
                 * Data di scadenza del documento (dovrebbe essere YYYY-MM-DD), se non è presente è `null`
                 */
                dataScadenza: string | null;
                /**
                 * Operazione
                 */
                operazione: string;
                /**
                 * Presa adesione richiesta
                 */
                adRichiesta: boolean;
                /**
                 * Presa visione confermata
                 */
                isPresaVisione: boolean;
                /**
                 * Data in cui è stata confermata la presa adesione (YYYY-MM-DD), se non è stata confermata è una stringa vuota
                 */
                dataConfermaPresaAdesione: string;
                /**
                 * Codice di identificazione del documento
                 */
                pk: string;
                /**
                 * Lista di allegati del documento
                 */
                allegati: {
                    /**
                     * Nome del file
                     */
                    nomeFile: string;
                    /**
                     * Path del file
                     */
                    path: string;
                    /**
                     * Descrizione del file, se non è presente è `null`
                     */
                    descrizione: string | null;
                    /**
                     * Codice di identificazione del file
                     */
                    pk: string;
                    /**
                     * URL del file (per scaricare l'allegato c'è bisogno di utilizzare <ArgoClient>.argo.downloadAllegato(pk))
                     */
                    url: string;
                }[]
                /**
                 * Data di scadenza dell'adesione (dovrebbe essere YYYY-MM-DD), se non è presente è `null`
                 */
                dataScadenzaAdesione: string | null;
                /**
                 * Presa adesione confermata
                 */
                isPresaAdesione: boolean;
            }[]
            /**
             * File condivisi tra docenti e famiglia (no documentazione)
             */
            fileCondivisi: {
                fileAlunniScollegati: []
                fileAlunniCollegati: []
            }
            /**
             * Voti
             */
            voti: {
                /**
                * Data in cui è stato inserito il documento (in formato YYYY-MM-DD HH:mm:ss)
                */
                datEvento: string;
                /**
                 * Codice di identificazione del periodo in cui è stato inserito il voto
                 */
                pkPeriodo: string;
                /**
                 * Voto (in una stringa)
                 */
                codCodice: string;
                /**
                 * Voto (in un numero)
                 */
                valore: number;
                /**
                 * Codice voto pratico (?)
                 */
                codVotoPratico: string;
                /**
                 * Nome del docente
                 */
                docente: string;
                /**
                 * Codice di identificazione della materia del voto
                 */
                pkMateria: string;
                /**
                 * Tipo di valutazione (sconosciuto al momento)
                 */
                tipoValutazione: any;
                /**
                 * Sconosciuto
                 */
                prgVoto: number;
                /**
                 * Operazione
                 */
                operazione: string;
                /**
                 * Descrizione della prova
                 */
                descrizioneProva: string;
                /**
                 * Può contenere informazioni come se il voto fa media o no
                 */
                faMenoMedia: string;
                /**
                 * Codice di identificazione del docente
                 */
                pkDocente: string;
                /**
                 * Voto scritto a parole (es. sette invece di 7)
                 */
                descrizioneVoto: string;
                /**
                 * Sconosciuto
                 */
                codTipo: string;
                /**
                 * Data in cui è stato inserito il voto (YYYY-MM-DD)
                 */
                datGiorno: string;
                /**
                 * Numero del mese dell'anno in cui è stato inserito il voto
                 */
                mese: number;
                /**
                 * Numero media (?)
                 */
                numMedia: number;
                /**
                 * Codice di identificazione del voto
                 */
                pk: string;
                /**
                 * Nome materia
                 */
                desMateria: string;
                /**
                 * Variante "light" della materia (sembra contenere dati ridotti della materia)
                 */
                materiaLight: {
                    /**
                     * Informazioni sulla materia (?)
                     */
                    scuMateriaPK: {
                        /**
                         * Codice della scuola
                         */
                        codMin: string;
                        /**
                         * Sconosciuto
                         */
                        prgScuola: number;
                        /**
                         * Anno corrente (YYYY)
                         */
                        annoScolastico: number;
                        /**
                         * Sconosciuto
                         */
                        prgMateria: number;
                    }
                    /**
                     * Codice materia
                     */
                    codMateria: string;
                    /**
                     * Nome della materia
                     */
                    desDescrizione: string;
                    /**
                     * Nome abbreviato della materia
                     */
                    desDescrAbbrev: string;
                    /**
                     * Codice suddivisione (?)
                     */
                    codSuddivisione: string;
                    /**
                     * Sconosciuto
                     */
                    codTipo: string;
                    /**
                     * Fa parte della media o no (Molto probabile che è `S` o `N`)
                     */
                    flgConcorreMedia: string;
                    /**
                     * Sconosciuto
                     */
                    codAggrDisciplina: any;
                    /**
                     * Indica se il voto è una lezione individuale o no (molto probabilmente scorretto)
                     */
                    flgLezioniIndividuali: any;
                    /**
                     * Codice ministreriale
                     */
                    codMinistreriale: string;
                    /**
                     * Icona della materia
                     */
                    icona: string;
                    /**
                     * Descrizione della materia
                     */
                    descrizione: string;
                    /**
                     * Contiene insufficienze
                     */
                    conInsufficienze: boolean;
                    /**
                     * Selezionata (?)
                     */
                    selezionata: boolean;
                    /**
                     * Viene molto probabilmente utilizzato per la UI
                     */
                    tipoOnGrid: string; // "(Materia)"
                    /**
                     * Sconosciuto
                     */
                    prgMateria: number;
                    /**
                     * Contiene il tipo di materia (Ad esempio in Inglese sarà "Lingua Straniera", mentre in Italiano sarà "Normale")
                     */
                    tipo: string;
                    /**
                     * ? Potrebbe riferirsi a su che cosa si basa la materia (Orale, Scritta, ecc.)
                     */
                    articolata: string;
                    /**
                     * Se la materia si basa su lezioni individuali o no
                     */
                    lezioniIndividuali: boolean;
                    /**
                     * Id della materia
                     */
                    idmateria: string;
                    /**
                     * Descrizione materia
                     */
                    codEDescrizioneMateria: string;
                }
                /**
                 * Descrizione del voto
                 */
                desCommento: string;
            }[]
            /**
             * Un qualcosa di client side che non so cosa sia, magari serve a riscaricare i dati?
             */
            ricaricaDati: boolean;
            /**
             * Lista di docenti della classe
             */
            listaDocentiClasse: {
                /**
                 * Cognome del docente
                 */
                desCognome: string;
                /**
                 * Array di materie insegnate dal docente (nome)
                 */
                materie: string[];
                /**
                 * Nome del docente
                 */
                desNome: string;
                /**
                 * Codice di identificazione del docente
                 */
                pk: string;
                /**
                 * Email del docente
                 */
                desEmail: string;
            }[]
            /**
             * Bacheca alunno, la documentazione potrebbe essere errata
             */
            bachecaAlunno: {
                /**
                 * Nome del file
                 */
                nomeFile: string;
                /**
                 * Data in cui è stato inserito il documento (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Messaggio del documento
                 */
                messaggio: string;
                /**
                 * URL di download per il genitore
                 */
                flgDownloadGenitore: string;
                /**
                 * Presa visione
                 */
                isPresaVisione: boolean;
                /**
                 * Codice di identificazione del documento
                 */
                pk: string;
            }[];
            /**
             * Profilo disabilitato
             */
            profiloDisabilitato: boolean;
            /**
             * Media per periodo
             */
            mediaPerPeriodo: {
                [codPeriodo: string]: {
                    /**
                     * Media generale
                     */
                    mediaGenerale: number;
                    /**
                     * Lista materie, non documentato
                     */
                    listaMaterie: any;
                    /**
                     * Media per ogni mese
                     */
                    mediaPerMese: Record<string, number>;
                };
            };
            /**
             * Media di ogni materia
             */
            mediaMaterie: {
                [pk: string]: {
                    /**
                     * Media di valutazioni orali
                     */
                    sommaValutazioniOrale: number;
                    /**
                     * Numero di valutazioni orali
                     */
                    numValutazioniOrale: number;
                    /**
                     * Media totale della matreria
                     */
                    mediaTotale: number;
                    /**
                     * Media scritta della materia
                     */
                    mediaScritta: number;
                    /**
                     * Somma valori (?)
                     */
                    sumValori: number;
                    /**
                     * Numero valori (?)
                     */
                    numValori: number;
                    /**
                     * Numero voti
                     */
                    numVoti: number;
                    /**
                     * Numero valutazioni scritte
                     */
                    numValutazioniScritto: number;
                    /**
                     * Media di valutaizoni scritte
                     */
                    sommaValutazioniScritto: number;
                    /**
                     * Media orale
                     */
                    mediaOrale: number;
                }
            }
            /**
             * Autocertificazione - non documentato
             */
            autocertificazione: any;
            /**
             * Registro, contiene attività svolta in classe e compiti
             */
            registro: {
                /**
                 * Operazione
                 */
                operazione: string;
                /**
                 * Data in cui è stato inserito il registro (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Url (sconosciuto)
                 */
                desUrl: string;
                /**
                 * Codice di identificazione del docente
                 */
                pkDocente: string;
                /**
                 * Compiti
                 */
                compiti: {
                    /**
                     * Il compito in sè
                     */
                    compito: string;
                    /**
                     * Data di consegna del compito (YYYY-MM-DD)
                     */
                    dataConsegna: string;
                }[]
                /**
                 * Data in cui è stato inserito il registro (YYYY-MM-DD)
                 */
                datGiorno: string;
                /**
                 * Nome del docente
                 */
                docente: string;
                /**
                 * Nome della materia
                 */
                materia: string;
                /**
                 * Codice di identificazione del registro
                 */
                pk: string;
                /**
                 * Codice di identificazione della materia
                 */
                pkMateria: string;
                /**
                 * Attività svolta in classe
                 */
                attivita: string;
                /**
                 * Ora scolastica in cui l'inserimento è accaduto (1,2,3,4,5,6...)
                 */
                ora: number;
            }[];
            /**
             * Schede - non documentato
             */
            schede: any;
            /**
             * Prenotazioni alunni (Potrebbe riferirsi al colloquio con i docenti, lo vedremo nel corso dell'anno loool) - non documentato
             */
            prenotazioniAlunni: any;
            /**
             * Note disciplinari - non documentato
             */
            noteDisciplinari: any;
            /**
             * Codice identificativo dell'utente
             */
            pk: string;
            /**
             * Eventi dell'appello
             */
            appello: {
                /**
                 * Operazione
                 */
                operazione: string;
                /**
                 * Data in cui è stato inserito l'appello (in formato YYYY-MM-DD HH:mm:ss)
                 */
                datEvento: string;
                /**
                 * Descrizione dell'appello
                 */
                descrizione: string;
                /**
                 * Da giustificare
                 */

                daGiustificare: boolean;
                /**
                 * Giustificata (S/N)
                 */
                giustificata: string;
                /**
                 * Data in cui è stato inserito l'appello (YYYY-MM-DD)
                 */
                data: string;
                /**
                 * Codice evento
                 */
                codEvento: string;
                /**
                 * Nome del docente
                 */
                docente: string;
                /**
                 * Commento della giustifica
                 */
                commentoGiustificazione: string;
                /**
                 * Codice di identificazione dell'evento
                 */
                pk: string;
                /**
                 * Data di giustificazione (YYYY-MM-DD || "")
                 */
                dataGiustificazione: string;
                /**
                 * Nota dell'evento
                 */
                nota: string;
            }[]
            /**
             * Indica se l'utente ha classi extra o no
             */
            classiExtra: boolean;
        }
    ]
}