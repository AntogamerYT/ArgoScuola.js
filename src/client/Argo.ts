import { APIDashboard } from "../types/Types.js";
import { ArgoClient } from "./ArgoClient";


export class Argo {
    private client: ArgoClient;

    constructor(client: ArgoClient) {
        this.client = client;
    }

    /**
     * Ottieni i dati scolastici (compiti, voti, agenda...), potrebbe diventare una richiesta molto pesante (a livello di body di risposta) nel corso dell'anno scolastico
     * @returns {Promise<APIDashboard>}
     */
    public async getDashboard(): Promise<APIDashboard> {
        if (!this.client.dataAggiornaData) this.client.dataAggiornaData = this.client.utilities.formattaDataUltimoAggiornamento(new Date(`${new Date().getFullYear()}-09-01:00:00:00.000Z`));


        return (await this.client.sendArgoRequest("/dashboard/dashboard", "POST", true, JSON.stringify({
            dataultimoaggiornamento: this.client.dataAggiornaData,
            opzioni: "{\"ORARIO_SCOLASTICO\":true,\"PAGELLINO_ONLINE\":true,\"VALUTAZIONI_PERIODICHE\":true,\"VALUTAZIONI_GIORNALIERE\":true,\"COMPITI_ASSEGNATI\":true,\"IGNORA_OPZIONE_VOTI_DOCENTI\":false,\"DOCENTI_CLASSE\":true,\"RENDI_VISIBILE_CURRICULUM\":true,\"RICHIESTA_CERTIFICATI\":false,\"MODIFICA_RECAPITI\":true,\"CONSIGLIO_DI_ISTITUTO\":true,\"NOTE_DISCIPLINARI\":true,\"GIUDIZI\":false,\"GIUSTIFICAZIONI_ASSENZE\":true,\"TABELLONE_PERIODI_INTERMEDI\":false,\"PAGELLE_ONLINE\":true,\"ASSENZE_PER_DATA\":true,\"ARGOMENTI_LEZIONE\":false,\"NASCONDI_DIDUP_FAMIGLIA\":true,\"ALILITA_BSMART_FAMIGLIA\":false,\"VOTI_GIUDIZI\":true,\"ABILITA_AUTOCERTIFICAZIONE_FAM\":false,\"MOSTRA_MEDIA_GENERALE\":true,\"TABELLONE_SCRUTINIO_FINALE\":false,\"PIN_VOTI\":false,\"DISABILITA_ACCESSO_FAMIGLIA\":true,\"TASSE_SCOLASTICHE\":true,\"PROMEMORIA_CLASSE\":true,\"PRENOTAZIONE_ALUNNI\":true,\"CONSIGLIO_DI_CLASSE\":true}"
        }))).response as APIDashboard;
    }

    /**
     * Aggiorna la data di aggiornamento dei dati, necessario per alcune richieste come `what` e `/dashboard/dashboard`
     * @param data Data da cui aggiornare i dati
     * @returns {Promise<boolean>} 
     */
    public async aggiornaData(data: Date): Promise<boolean> {
        const req = await this.client.sendArgoRequest("/dashboard/aggiornadata", "POST", false, JSON.stringify({
            dataultimoaggiornamento: this.client.utilities.formattaDataUltimoAggiornamento(data)
        }))
        if (req.status === 200) {
            this.client.dataAggiornaData = this.client.utilities.formattaDataUltimoAggiornamento(data);
            return true;
        } else return false;
    }
}