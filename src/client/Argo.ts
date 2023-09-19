import { APIDashboard, APIProfilo, Profilo } from "../types/Types.js";
import { ArgoClient } from "./ArgoClient";


export class Argo {
    private client: ArgoClient;
    private profiloSelezionato: {
        profilo: APIProfilo;
        token: string;
    } | undefined;

    constructor(client: ArgoClient) {
        this.client = client;
    }

    /**
     * Ottieni i dati scolastici (compiti, voti, agenda...), potrebbe diventare una richiesta molto pesante (a livello di body di risposta) nel corso dell'anno scolastico
     */
    public async getDashboard(): Promise<APIDashboard> {
        if (!this.client.dataAggiornaData) this.client.dataAggiornaData = this.client.utilities.formattaDataUltimoAggiornamento(new Date(`${new Date().getFullYear()}-09-01:00:00:00.000Z`));
        if (!this.profiloSelezionato) throw new Error("Profilo non selezionato, si prega di selezionarne uno con il metodo client.argo.selectUser()");

        return (await this.client.sendArgoRequest("/dashboard/dashboard", "POST", true, JSON.stringify({
            dataultimoaggiornamento: this.client.dataAggiornaData,
            opzioni: "{\"ORARIO_SCOLASTICO\":true,\"PAGELLINO_ONLINE\":true,\"VALUTAZIONI_PERIODICHE\":true,\"VALUTAZIONI_GIORNALIERE\":true,\"COMPITI_ASSEGNATI\":true,\"IGNORA_OPZIONE_VOTI_DOCENTI\":false,\"DOCENTI_CLASSE\":true,\"RENDI_VISIBILE_CURRICULUM\":true,\"RICHIESTA_CERTIFICATI\":false,\"MODIFICA_RECAPITI\":true,\"CONSIGLIO_DI_ISTITUTO\":true,\"NOTE_DISCIPLINARI\":true,\"GIUDIZI\":true,\"GIUSTIFICAZIONI_ASSENZE\":true,\"TABELLONE_PERIODI_INTERMEDI\":true,\"PAGELLE_ONLINE\":true,\"ASSENZE_PER_DATA\":true,\"ARGOMENTI_LEZIONE\":true,\"NASCONDI_DIDUP_FAMIGLIA\":true,\"ALILITA_BSMART_FAMIGLIA\":false,\"VOTI_GIUDIZI\":true,\"ABILITA_AUTOCERTIFICAZIONE_FAM\":false,\"MOSTRA_MEDIA_GENERALE\":true,\"TABELLONE_SCRUTINIO_FINALE\":true,\"PIN_VOTI\":true,\"DISABILITA_ACCESSO_FAMIGLIA\":true,\"TASSE_SCOLASTICHE\":true,\"PROMEMORIA_CLASSE\":true,\"PRENOTAZIONE_ALUNNI\":true,\"CONSIGLIO_DI_CLASSE\":true}"
        }), {
            "x-auth-token": this.profiloSelezionato?.token
        })).response.data as APIDashboard;
    }

    /**
     * Seleziona l'utente salvando il mobile token di esso (obbligatorio per richieste come getDashboard()
     * @param nomeCognome Nome e cognome dell'utente da selezionare 
     * @example ```js
     * client.argo.selectUser("Antonio", "Cavaliere");
     * ```
     */
    public async selectUser(nome: string, cognome: string): Promise<{
        profilo: APIProfilo;
        token: string;
    }> {
        const profili = await this.getProfili();


        const profilo = profili.find(profilo => profilo.profilo.alunno.nominativo.toLowerCase() === `${cognome.toLowerCase()} ${nome.toLowerCase()}`);

        if (!profilo) throw new Error("Profilo non trovato");

        this.profiloSelezionato = profilo;
        return profilo;
    }

    /**
     * 
     */
    public async getProfili(): Promise<{
        profilo: APIProfilo;
        token: string;
    }[]> {
        const res = await this.client.sendArgoRequest("/login", "POST", true, JSON.stringify({
            "lista-opzioni-notifiche": "{}",
            "lista-x-auth-token": "[]",
            clientID: "d8MtQX5fR3yS9I7k-5OXUs:APA91bErrU-H7wGQ8yLastE_xS2JHDrVrfReRY2mnWQ9aVd-ohWYDTSLVRrKUsO2-25mBN1aduh5sPnZjFstg0Ixqiuoh5wCC38BB6NEveqWI_d6ZpM5DN3nvyVS8vDtwLS9caWeCmEK"
        }))

        let profili: {
            profilo: APIProfilo;
            token: string;
        }[] = []

        for (let profile of res.response.data) {
            const profileReq = await this.client.sendArgoRequest("/profilo", "GET", true, undefined, {
                "x-auth-token": profile.token
            })

            const profileData = profileReq.response.data as APIProfilo;

            profili.push({
                profilo: profileData,
                token: profile.token
            });
        }

        return profili;
    }

    /**
     * Aggiorna la data di aggiornamento dei dati, necessario per alcune richieste come `what` e `/dashboard/dashboard`
     * @param data Data da cui aggiornare i dati
     */
    public async aggiornaData(data: Date): Promise<boolean> {
        const req = await this.client.sendArgoRequest("/dashboard/aggiornadata", "POST", false, JSON.stringify({
            dataultimoaggiornamento: this.client.utilities.formattaDataUltimoAggiornamento(data)
        }))
        if (req.status === 200) {
            this.client.dataAggiornaData = this.client.utilities.formattaDataUltimoAggiornamento(data);
            return true;
        }

        return false;
    }
}