import { ARGO_CONSTANTS } from "../types/config.js";
import type { APIDashboard, APIWhat, GetWhatOptions, WhatDateInput } from "../types/dashboard.js";
import type { ProfiloSelezionato } from "../types/profilo.js";
import type { ApiClient } from "../http/apiClient.js";
import { formatArgoDate } from "../auth/tokenUtils.js";

export interface ArgoDeps {
    api: ApiClient;
    getDataAggiorna: () => string;
    setDataAggiorna: (value: string) => void;
}

interface LoginProfileEntry {
    token: string;
}

export const DASHBOARD_OPZIONI = {
    ORARIO_SCOLASTICO: true,
    PAGELLINO_ONLINE: false,
    ABILITA_PREAUTORIZZAZIONI_FAM: false,
    VALUTAZIONI_PERIODICHE: true,
    ABILITA_PCTO: true,
    VISUALIZZA_NOTA_VALUTAZIONE: false,
    VALUTAZIONI_GIORNALIERE: true,
    INVALSI: true,
    COMPITI_ASSEGNATI: true,
    IGNORA_OPZIONE_VOTI_DOCENTI: false,
    DOCENTI_CLASSE: true,
    RECUPERO_DEBITO_SF: true,
    PFI: false,
    RENDI_VISIBILE_CURRICULUM: true,
    RICHIESTA_CERTIFICATI: false,
    MODIFICA_RECAPITI: false,
    ABILITA_GIUSTIFIC_MAGGIORENNI: true,
    ASL: false,
    CONSIGLIO_DI_ISTITUTO: true,
    NOTE_DISCIPLINARI: true,
    ABILITA_MENSA: false,
    GIUDIZI: false,
    ABILITA_PFI: true,
    MOSTRA_MEDIA_MATERIA: true,
    GIUSTIFICAZIONI_ASSENZE: true,
    TABELLONE_PERIODI_INTERMEDI: false,
    PAGELLE_ONLINE: true,
    ASSENZE_PER_DATA: true,
    VALUTAZIONI_SOSPESE_PERIODICHE: false,
    ARGOMENTI_LEZIONE: true,
    NASCONDI_DIDUP_FAMIGLIA: true,
    ALILITA_BSMART_FAMIGLIA: false,
    WSM: false,
    VOTI_GIUDIZI: false,
    RECUPERO_DEBITO_INT: true,
    ABILITA_AUTOCERTIFICAZIONE_FAM: false,
    MOSTRA_MEDIA_GENERALE: true,
    TABELLONE_SCRUTINIO_FINALE: false,
    PIN_VOTI: false,
    DISABILITA_ACCESSO_FAMIGLIA: true,
    TASSE_SCOLASTICHE: true,
    PROMEMORIA_CLASSE: true,
    PRENOTAZIONE_ALUNNI: true,
    CONSIGLIO_DI_CLASSE: true,
} as const;

function defaultSchoolYearStart(): string {
    const start = new Date(Date.UTC(new Date().getUTCFullYear(), 8, 1, 0, 0, 0));
    return formatArgoDate(start);
}

function normalizeName(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export class Argo {
    private readonly api: ApiClient;
    private readonly getDataAggiorna: () => string;
    private readonly setDataAggiorna: (value: string) => void;
    private profiloSelezionato: ProfiloSelezionato | undefined;
    private cachedAccountTokens: string[] = [];

    constructor(deps: ArgoDeps) {
        this.api = deps.api;
        this.getDataAggiorna = deps.getDataAggiorna;
        this.setDataAggiorna = deps.setDataAggiorna;
    }

    get selectedProfile(): ProfiloSelezionato | undefined {
        return this.profiloSelezionato;
    }

    clearSelection(): void {
        this.profiloSelezionato = undefined;
    }

    private loginPayload() {
        return JSON.stringify({
            "lista-opzioni-notifiche": "{}",
            "lista-x-auth-token": "[]",
            clientID: ARGO_CONSTANTS.fcmClientId,
        });
    }

    /**
     * Restituisce i dati scolastici (come compiti, voti, bacheca, ecc.). 
     * Senza argomento usa la data salvata via `aggiornaData()` (default: 1 settembre)
     * passando `data` si chiede il delta da quella data esatta, restituendo quindi i dati aggiunti da quella data in poi.
     */
    public async getDashboard(data?: WhatDateInput): Promise<APIDashboard> {
        const dataultimoaggiornamento =
            data !== undefined
                ? data instanceof Date
                    ? formatArgoDate(data)
                    : data
                : this.getDataAggiorna() || defaultSchoolYearStart();
        if (!this.profiloSelezionato) throw new Error("Profilo non selezionato, si prega di selezionarne uno con il metodo client.argo.selectUser()");

        const res = await this.api.request<{ data: APIDashboard }>("/dashboard/dashboard", "POST", {
            body: JSON.stringify({
                dataultimoaggiornamento,
                opzioni: JSON.stringify(DASHBOARD_OPZIONI),
            }),
            headers: { "x-auth-token": this.profiloSelezionato.token },
        });
        return (res.response as unknown as { data: APIDashboard }).data as APIDashboard;
    }

    /**
     * Seleziona l'utente salvando il mobile token di esso (obbligatorio per richieste come getDashboard()
     * @param nome Nome dell'alunno
     * @param cognome Cognome dell'alunno
     * @example ```js
     * client.argo.selectUser("Antonio", "Cavaliere");
     * ```
     */
    public async selectUser(nome: string, cognome: string): Promise<ProfiloSelezionato> {
        const profili = await this.getProfili();
        const target = normalizeName(`${cognome} ${nome}`);
        const profilo = profili.find((p) => normalizeName(p.profilo.alunno.nominativo) === target);

        if (!profilo) throw new Error("Profilo non trovato");

        this.profiloSelezionato = profilo;
        return profilo;
    }

    public async getProfili(): Promise<ProfiloSelezionato[]> {
        const res = await this.api.request<{ data: LoginProfileEntry[] }>("/login", "POST", {
            body: this.loginPayload(),
        });
        const entries = (res.response as unknown as { data: LoginProfileEntry[] } | undefined)?.data ?? [];

        const results = await Promise.all(
            entries.map(async (entry) => {
                const profileReq = await this.api.request<{ data: ProfiloSelezionato["profilo"] }>(
                    "/profilo",
                    "GET",
                    { headers: { "x-auth-token": entry.token } },
                );
                const profileData = (profileReq.response as unknown as { data: ProfiloSelezionato["profilo"] }).data;
                return { profilo: profileData, token: entry.token } as ProfiloSelezionato;
            }),
        );

        this.cachedAccountTokens = results.map((r) => r.token);
        return results;
    }

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
    public async getWhat(data: WhatDateInput, opts: GetWhatOptions = {}): Promise<APIWhat> {
        if (!this.profiloSelezionato) throw new Error("Profilo non selezionato, si prega di selezionarne uno con il metodo client.argo.selectUser()");

        const dataultimoaggiornamento = data instanceof Date ? formatArgoDate(data) : data;
        const opzioni = typeof opts.opzioni === "string" ? opts.opzioni : JSON.stringify(opts.opzioni ?? DASHBOARD_OPZIONI);
        const selectedToken = this.profiloSelezionato.token;
        const accountTokens = opts.accountTokens ?? (this.cachedAccountTokens.length > 0 ? this.cachedAccountTokens : [selectedToken]);

        const res = await this.api.request<{ data: APIWhat }>("/dashboard/what", "POST", {
            body: JSON.stringify({
                dataultimoaggiornamento,
                opzioni,
                "lista-x-auth-token": JSON.stringify([selectedToken]),
                "lista-x-auth-token-account": JSON.stringify(accountTokens),
            }),
            headers: { "x-auth-token": selectedToken },
        });
        const body = res.response as unknown as { data: APIWhat } | undefined;
        if (!body?.data) throw new Error(`Risposta /dashboard/what non valida (status ${res.status})`);
        return body.data;
    }

    /**
     * Aggiorna la data di aggiornamento dei dati, necessario per alcune richieste come `/dashboard/dashboard`
     * @param data Data da cui aggiornare i dati
     */
    public async aggiornaData(data: Date): Promise<boolean> {
        const formatted = formatArgoDate(data);
        const headers = this.profiloSelezionato
            ? { "x-auth-token": this.profiloSelezionato.token }
            : undefined;
        const req = await this.api.request("/dashboard/aggiornadata", "POST", {
            parseBody: false,
            body: JSON.stringify({ dataultimoaggiornamento: formatted }),
            ...(headers ? { headers } : {}),
        });
        if (req.status === 200) {
            this.setDataAggiorna(formatted);
            return true;
        }
        return false;
    }
}
