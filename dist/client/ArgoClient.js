import { ARGO_CONSTANTS } from "../types/config.js";
import { getAccessToken } from "../methods/Login.js";
import { ApiClient } from "../http/apiClient.js";
import { FileTokenStore } from "../auth/tokenStore.js";
import { AuthService } from "../auth/authService.js";
import { requestRefreshToken } from "../auth/refreshToken.js";
import { emptyToken } from "../auth/tokenUtils.js";
import { Utilities } from "./Utilities.js";
import { Argo } from "./Argo.js";
export class ArgoClient {
    credentials;
    configDir;
    saveLoginFlag;
    dataAggiornaValue = "";
    store;
    api;
    auth;
    utilities;
    argo;
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
    constructor(opzioni) {
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
            fetchFreshToken: (creds) => getAccessToken(creds.codice_scuola, creds.username, creds.password),
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
    get accountCredentials() {
        return this.credentials;
    }
    get configPath() {
        return this.configDir;
    }
    get saveLogin() {
        return this.saveLoginFlag;
    }
    set saveLogin(v) {
        this.saveLoginFlag = v;
        this.store.enabled = v;
    }
    get dataAggiornaData() {
        return this.dataAggiornaValue;
    }
    set dataAggiornaData(v) {
        this.dataAggiornaValue = v;
    }
    get token() {
        return this.store.token ?? emptyToken();
    }
    set token(t) {
        this.store.token = t;
    }
    async persistToken() {
        if (!this.saveLoginFlag)
            return;
        const t = this.store.token;
        if (t)
            await this.store.save(t);
    }
    async login() {
        return await this.auth.login();
    }
    async logout() {
        await this.store.clear();
        this.argo.clearSelection();
    }
    async probeToken() {
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
    async sendArgoRequest(path, method, parseBody = true, body, headers) {
        return await this.api.request(path, method, { parseBody, body, headers });
    }
    async getProfile() {
        const selected = this.argo.selectedProfile;
        const req = await this.api.request("/profilo", "GET", {
            ...(selected ? { headers: { "x-auth-token": selected.token } } : {}),
        });
        const body = req.response;
        if (!body?.data)
            throw new Error(`Profilo non disponibile (status ${req.status})`);
        return body.data;
    }
}
