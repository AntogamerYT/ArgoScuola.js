import { ARGO_CONSTANTS } from "../types/config.js";
import type { ArgoRequestHeaders, HttpMethod } from "../types/http.js";
import { toExpiresAtHeaderValue } from "../auth/tokenUtils.js";
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

// Interfaccia usata per evitare di dover passare l'intero client a ApiClient
export interface ApiClientDeps {
    getAccessToken: () => string;
    getCodScuola: () => string;
    getExpiresAt: () => Token["expires_at"];
    refreshAuth: () => Promise<void>;
    fetchFn?: typeof fetch;
}

async function parseResponseBody(response: Response): Promise<unknown> {
    const rawBody = await response.text();
    if (!rawBody.trim()) return undefined;
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("application/json")) return rawBody;
    try {
        return JSON.parse(rawBody);
    } catch {
        return rawBody;
    }
}

export class ApiClient {
    private readonly deps: ApiClientDeps;
    private readonly fetchFn: typeof fetch;

    constructor(deps: ApiClientDeps) {
        this.deps = deps;
        this.fetchFn = deps.fetchFn ?? fetch;
    }

    async request<T = unknown>(
        path: string,
        method: HttpMethod,
        opts: ApiRequestOptions = {},
    ): Promise<ArgoResponse<T>> {
        const { parseBody = true, body, headers, signal } = opts;

        const doFetch = async (): Promise<Response> => {
            const requestHeaders: ArgoRequestHeaders = {
                Authorization: "Bearer " + this.deps.getAccessToken(),
                "argo-client-version": ARGO_CONSTANTS.clientVersion,
                "Content-Type": "application/json; charset=utf-8",
                "x-auth-token": "",
                "x-cod-min": this.deps.getCodScuola(),
                "x-date-exp-auth": toExpiresAtHeaderValue(this.deps.getExpiresAt()),
                ...headers,
            };
            const init: RequestInit = { method, headers: requestHeaders, signal };
            if (body !== undefined) (init as Record<string, unknown>).body = body;
            return await this.fetchFn(ARGO_CONSTANTS.baseApiURL + path, init);
        };

        let res = await doFetch();

        if (res.status === 401 && !path.includes("oauth")) {
            await this.deps.refreshAuth();
            res = await doFetch();
        }

        return {
            response: parseBody ? ((await parseResponseBody(res)) as T | undefined) : undefined,
            status: res.status,
            fetchResponse: res,
        };
    }
}
