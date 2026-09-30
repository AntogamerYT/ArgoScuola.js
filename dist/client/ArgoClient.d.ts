import type { HttpMethod, ArgoRequestHeaders } from "../types/http.js";
import type { ArgoClientOptions } from "../types/options.js";
import type { Token } from "../types/token.js";
import type { APIProfilo } from "../types/profilo.js";
import { type ArgoResponse } from "../http/apiClient.js";
import { type AccountCredentials } from "../auth/tokenStore.js";
import { Utilities } from "./Utilities.js";
import { Argo } from "./Argo.js";
export declare class ArgoClient {
    private readonly credentials;
    private readonly configDir;
    private saveLoginFlag;
    private dataAggiornaValue;
    private readonly store;
    private readonly api;
    private readonly auth;
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
    constructor(opzioni: ArgoClientOptions);
    get accountCredentials(): AccountCredentials;
    get configPath(): string;
    get saveLogin(): boolean;
    set saveLogin(v: boolean);
    get dataAggiornaData(): string;
    set dataAggiornaData(v: string);
    get token(): Token;
    set token(t: Token);
    persistToken(): Promise<void>;
    login(): Promise<Token>;
    logout(): Promise<void>;
    private probeToken;
    sendArgoRequest<T = unknown>(path: string, method: HttpMethod, parseBody?: boolean, body?: string, headers?: ArgoRequestHeaders): Promise<ArgoResponse<T>>;
    getProfile(): Promise<APIProfilo>;
}
