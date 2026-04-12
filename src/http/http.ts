import { HttpMethod, utilities } from "../types/Types.js";
import { ArgoClient } from "../client/ArgoClient.js";
import { getAccessToken } from "../methods/Login.js";

function getExpiresAtHeader(client: ArgoClient): string {
    if (!client.token.expires_at) return new Date().toISOString();

    const expiresAt = new Date(client.token.expires_at);
    if (Number.isNaN(expiresAt.getTime())) return new Date().toISOString();

    return expiresAt.toISOString();
}

async function parseResponseBody(response: Response): Promise<any | undefined> {
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

/**
 * Funzione per fare richieste ad Argo con autorizzatione già inserita, utile per richieste non implementate
 * @param client Istanza di ArgoClient
 * @param path Il percorso della richiesta
 * @param method Metodo HTTP (e.g. GET, POST, PUT, DELETE)
 * @param parseBody Se false, non parsare il body della risposta (response diventerà undefined), true di default
 * @param body Body della richiesta, se necessario
 * @param headers Headers aggiuntivi della richiesta (Passare authorization o qualunque header preimpostato lo sovrascriverà) 
 * @returns {Promise<{ response: any | undefined status: number; fetchResponse: Response; }>} Risposta della richiesta
 */
export async function sendArgoRequest(client: ArgoClient, path: string, method: HttpMethod, parseBody: boolean = true, body?: string, headers?: any): Promise<{ response: any | undefined; status: number; fetchResponse: Response; }> {
    const requestHeaders = {
        "Authorization": "Bearer " + client.token.access_token,
        "argo-client-version": "9.99.9",
        "content-type": "application/json; charset=utf-8",
        "x-auth-token": "",
        "x-cod-min": client.accountCredentials.codice_scuola,
        "x-date-exp-auth": getExpiresAtHeader(client),
        ...headers
    };

    const options = {
        method: method,
        headers: requestHeaders,
        body: body
    }

    if (body) {
        options.body = body;
    } else delete options.body;

    let res = await fetch(utilities.baseApiURL + path, options);

    if (res.status === 401 && !path.includes("oauth")) {
        const newToken = await client.utilities.requestRefreshToken();

        if (newToken) {
            client.token = newToken;
        } else {
            client.token = await getAccessToken(client.accountCredentials.codice_scuola, client.accountCredentials.username, client.accountCredentials.password);
        }

        client.persistToken();

        options.headers = {
            ...options.headers,
            "Authorization": "Bearer " + client.token.access_token,
            "x-date-exp-auth": getExpiresAtHeader(client)
        };

        res = await fetch(utilities.baseApiURL + path, options);
    }


    return {
        response: parseBody ? await parseResponseBody(res) : undefined,
        status: res.status,
        fetchResponse: res
    };
}
