import type { ArgoRequestHeaders, HttpMethod } from "../types/http.js";
import type { Token } from "../types/token.js";
export interface ArgoResponse<T = unknown> {
    response: T | undefined;
    status: number;
    fetchResponse: Response;
}
export interface ApiRequestOptions {
    parseBody?: boolean;
    body?: string;
    headers?: ArgoRequestHeaders;
    signal?: AbortSignal;
}
export interface ApiClientDeps {
    getAccessToken: () => string;
    getCodScuola: () => string;
    getExpiresAt: () => Token["expires_at"];
    refreshAuth: () => Promise<void>;
    fetchFn?: typeof fetch;
}
export declare class ApiClient {
    private readonly deps;
    private readonly fetchFn;
    constructor(deps: ApiClientDeps);
    request<T = unknown>(path: string, method: HttpMethod, opts?: ApiRequestOptions): Promise<ArgoResponse<T>>;
}
