import { ARGO_CONSTANTS } from "../types/config.js";
import { toExpiresAtHeaderValue } from "../auth/tokenUtils.js";
async function parseResponseBody(response) {
    const rawBody = await response.text();
    if (!rawBody.trim())
        return undefined;
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("application/json"))
        return rawBody;
    try {
        return JSON.parse(rawBody);
    }
    catch {
        return rawBody;
    }
}
export class ApiClient {
    deps;
    fetchFn;
    constructor(deps) {
        this.deps = deps;
        this.fetchFn = deps.fetchFn ?? fetch;
    }
    async request(path, method, opts = {}) {
        const { parseBody = true, body, headers, signal } = opts;
        const doFetch = async () => {
            const requestHeaders = {
                Authorization: "Bearer " + this.deps.getAccessToken(),
                "argo-client-version": ARGO_CONSTANTS.clientVersion,
                "Content-Type": "application/json; charset=utf-8",
                "x-auth-token": "",
                "x-cod-min": this.deps.getCodScuola(),
                "x-date-exp-auth": toExpiresAtHeaderValue(this.deps.getExpiresAt()),
                ...headers,
            };
            const init = { method, headers: requestHeaders, signal };
            if (body !== undefined)
                init.body = body;
            return await this.fetchFn(ARGO_CONSTANTS.baseApiURL + path, init);
        };
        let res = await doFetch();
        if (res.status === 401 && !path.includes("oauth")) {
            await this.deps.refreshAuth();
            res = await doFetch();
        }
        return {
            response: parseBody ? (await parseResponseBody(res)) : undefined,
            status: res.status,
            fetchResponse: res,
        };
    }
}
