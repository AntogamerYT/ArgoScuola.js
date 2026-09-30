import type { APIDashboard, APIWhat, GetWhatOptions, WhatDateInput } from "../types/dashboard.js";
import type { ProfiloSelezionato } from "../types/profilo.js";
import type { ApiClient } from "../http/apiClient.js";
export interface ArgoDeps {
    api: ApiClient;
    getDataAggiorna: () => string;
    setDataAggiorna: (value: string) => void;
}
export declare const DASHBOARD_OPZIONI: {
    readonly ORARIO_SCOLASTICO: true;
    readonly PAGELLINO_ONLINE: false;
    readonly ABILITA_PREAUTORIZZAZIONI_FAM: false;
    readonly VALUTAZIONI_PERIODICHE: true;
    readonly ABILITA_PCTO: true;
    readonly VISUALIZZA_NOTA_VALUTAZIONE: false;
    readonly VALUTAZIONI_GIORNALIERE: true;
    readonly INVALSI: true;
    readonly COMPITI_ASSEGNATI: true;
    readonly IGNORA_OPZIONE_VOTI_DOCENTI: false;
    readonly DOCENTI_CLASSE: true;
    readonly RECUPERO_DEBITO_SF: true;
    readonly PFI: false;
    readonly RENDI_VISIBILE_CURRICULUM: true;
    readonly RICHIESTA_CERTIFICATI: false;
    readonly MODIFICA_RECAPITI: false;
    readonly ABILITA_GIUSTIFIC_MAGGIORENNI: true;
    readonly ASL: false;
    readonly CONSIGLIO_DI_ISTITUTO: true;
    readonly NOTE_DISCIPLINARI: true;
    readonly ABILITA_MENSA: false;
    readonly GIUDIZI: false;
    readonly ABILITA_PFI: true;
    readonly MOSTRA_MEDIA_MATERIA: true;
    readonly GIUSTIFICAZIONI_ASSENZE: true;
    readonly TABELLONE_PERIODI_INTERMEDI: false;
    readonly PAGELLE_ONLINE: true;
    readonly ASSENZE_PER_DATA: true;
    readonly VALUTAZIONI_SOSPESE_PERIODICHE: false;
    readonly ARGOMENTI_LEZIONE: true;
    readonly NASCONDI_DIDUP_FAMIGLIA: true;
    readonly ALILITA_BSMART_FAMIGLIA: false;
    readonly WSM: false;
    readonly VOTI_GIUDIZI: false;
    readonly RECUPERO_DEBITO_INT: true;
    readonly ABILITA_AUTOCERTIFICAZIONE_FAM: false;
    readonly MOSTRA_MEDIA_GENERALE: true;
    readonly TABELLONE_SCRUTINIO_FINALE: false;
    readonly PIN_VOTI: false;
    readonly DISABILITA_ACCESSO_FAMIGLIA: true;
    readonly TASSE_SCOLASTICHE: true;
    readonly PROMEMORIA_CLASSE: true;
    readonly PRENOTAZIONE_ALUNNI: true;
    readonly CONSIGLIO_DI_CLASSE: true;
};
export declare class Argo {
    private readonly api;
    private readonly getDataAggiorna;
    private readonly setDataAggiorna;
    private profiloSelezionato;
    private cachedAccountTokens;
    constructor(deps: ArgoDeps);
    get selectedProfile(): ProfiloSelezionato | undefined;
    clearSelection(): void;
    private loginPayload;
    /**
     * Restituisce i dati scolastici (come compiti, voti, bacheca, ecc.).
     * Senza argomento usa la data salvata via `aggiornaData()` (default: 1 settembre)
     * passando `data` si chiede il delta da quella data esatta, restituendo quindi i dati aggiunti da quella data in poi.
     */
    getDashboard(data?: WhatDateInput): Promise<APIDashboard>;
    /**
     * Seleziona l'utente salvando il mobile token di esso (obbligatorio per richieste come getDashboard()
     * @param nome Nome dell'alunno
     * @param cognome Cognome dell'alunno
     * @example ```js
     * client.argo.selectUser("Antonio", "Cavaliere");
     * ```
     */
    selectUser(nome: string, cognome: string): Promise<ProfiloSelezionato>;
    getProfili(): Promise<ProfiloSelezionato[]>;
    /**
     * Dice se ci sono novità da una certa data, senza scaricare tutti i dati (da usare prima di `getDashboard()` per capire se richiedere il delta o no)
     *
     *
     * @param data Data da cui cercare novità (Date oppure stringa già formattata, es. `"2023-04-06 18:47:30.408482"`)
     * @param opts.opzioni Default = stesse di `getDashboard()`; oggetto o stringa già serializzata
     * @param opts.accountTokens Default = token cachati da `getProfili()` oppure `[selectedToken]`
     * @example
     * ```js
     * const ieri = new Date(Date.now() - 24 * 3600 * 1000);
     * await client.argo.aggiornaData(ieri);
     * const delta = await client.argo.getWhat(ieri);
     * console.log(delta.dati[0].isModificato);
     * ```
     */
    getWhat(data: WhatDateInput, opts?: GetWhatOptions): Promise<APIWhat>;
    /**
     * Aggiorna la data di aggiornamento dei dati, necessario per alcune richieste come `/dashboard/dashboard`
     * @param data Data da cui aggiornare i dati
     */
    aggiornaData(data: Date): Promise<boolean>;
    /**
     * Ottiene l'URL temporaneo (firmato S3) per scaricare un allegato di bacheca.
     * @param uid pk dell'allegato (es. `listaAllegati[0].pk` di un item bacheca)
     * @param pkScheda pk della scheda alunno; default = scheda del profilo selezionato
     * @returns URL temporaneo da cui scaricare il file
     * @example
     * ```js
     * const url = await client.argo.downloadAllegatoBacheca(allegatoPk);
     * const file = await (await fetch(url)).arrayBuffer();
     * ```
     */
    downloadAllegatoBacheca(uid: string, pkScheda?: string): Promise<string>;
}
