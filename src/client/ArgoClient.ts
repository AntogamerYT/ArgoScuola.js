import { ARGO_CONSTANTS } from "../types/config.js";
import type { HttpMethod, ArgoRequestHeaders } from "../types/http.js";
import type { ArgoClientOptions } from "../types/options.js";
import type { Token } from "../types/token.js";
import type { APIProfilo } from "../types/profilo.js";
import { getAccessToken } from "../methods/Login.js";
import { ApiClient, type ArgoResponse } from "../http/apiClient.js";
import { FileTokenStore, type AccountCredentials } from "../auth/tokenStore.js";
import { AuthService } from "../auth/authService.js";
import { requestRefreshToken } from "../auth/refreshToken.js";
import { emptyToken } from "../auth/tokenUtils.js";
import { Utilities } from "./Utilities.js";
import { Argo } from "./Argo.js";

export class ArgoClient {
    private readonly credentials: AccountCredentials;
    private readonly configDir: string;
    private saveLoginFlag: boolean;
    private dataAggiornaValue = "";
    private readonly store: FileTokenStore;
    private readonly api: ApiClient;
    private readonly auth: AuthService;

    readonly utilities: Utilities;
    readonly argo: Argo;

    /**
     * @param opzioni prese da ArgoClientOptions
     * @example
     * ```js
     * import { ArgoClient } from "argoscuola.js";
     * const client = new ArgoClient({
     *    codScuola: "AB12345",
     *    username: "utente",
     *    password: "LaMiaPassword",
     * });
     * ```
     */
    constructor(opzioni: ArgoClientOptions) {
        this.credentials = {
            codice_scuola: opzioni.codScuola,
            username: opzioni.username,
            password: opzioni.password,
        };
        this.configDir = opzioni.configPath ?? "./.argo/";
        this.saveLoginFlag = opzioni.saveLogin ?? true;

        this.store = new FileTokenStore({
            dir: this.configDir,
            codiceScuola: this.credentials.codice_scuola,
            username: this.credentials.username,
            enabled: this.saveLoginFlag,
        });

        this.utilities = new Utilities(() => this.store.token?.refresh_token ?? "");

        this.api = new ApiClient({
            getAccessToken: () => this.store.token?.access_token ?? "",
            getCodScuola: () => this.credentials.codice_scuola,
            getExpiresAt: () => this.store.token?.expires_at,
            refreshAuth: async () => {
                await this.auth.refreshOrRelogin();
            },
        });

        this.auth = new AuthService({
            credentials: this.credentials,
            tokenStore: this.store,
            fetchFreshToken: (creds) =>
                getAccessToken(creds.codice_scuola, creds.username, creds.password),
            requestRefreshToken: (rt) => requestRefreshToken(rt),
            validateToken: () => this.probeToken(),
        });

        this.argo = new Argo({
            api: this.api,
            getDataAggiorna: () => this.dataAggiornaValue,
            setDataAggiorna: (v) => {
                this.dataAggiornaValue = v;
            },
        });
    }

    get accountCredentials(): AccountCredentials {
        return this.credentials;
    }

    get configPath(): string {
        return this.configDir;
    }

    get saveLogin(): boolean {
        return this.saveLoginFlag;
    }

    set saveLogin(v: boolean) {
        this.saveLoginFlag = v;
        this.store.enabled = v;
    }

    get dataAggiornaData(): string {
        return this.dataAggiornaValue;
    }

    set dataAggiornaData(v: string) {
        this.dataAggiornaValue = v;
    }

    get token(): Token {
        return this.store.token ?? emptyToken();
    }

    set token(t: Token) {
        this.store.token = t;
    }

    public async persistToken(): Promise<void> {
        if (!this.saveLoginFlag) return;
        const t = this.store.token;
        if (t) await this.store.save(t);
    }

    public async login(): Promise<Token> {
        return await this.auth.login();
    }

    public async logout(): Promise<void> {
        await this.store.clear();
        this.argo.clearSelection();
    }

    private async probeToken(): Promise<boolean> {
        const req = await this.api.request("/login", "POST", {
            parseBody: false,
            body: JSON.stringify({
                "lista-opzioni-notifiche": "{}",
                "lista-x-auth-token": "[]",
                clientID: ARGO_CONSTANTS.fcmClientId,
            }),
        });
        return req.status !== 401;
    }

    public async sendArgoRequest<T = unknown>(
        path: string,
        method: HttpMethod,
        parseBody = true,
        body?: string,
        headers?: ArgoRequestHeaders,
    ): Promise<ArgoResponse<T>> {
        return await this.api.request<T>(path, method, { parseBody, body, headers });
    }

    public async getProfile(): Promise<APIProfilo> {
        const selected = this.argo.selectedProfile;
        const req = await this.api.request<{ data: APIProfilo }>("/profilo", "GET", {
            ...(selected ? { headers: { "x-auth-token": selected.token } } : {}),
        });
        const body = req.response as unknown as { data: APIProfilo } | undefined;
        if (!body?.data) throw new Error(`Profilo non disponibile (status ${req.status})`);
        return body.data;
    }
}
