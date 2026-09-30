import { ARGO_CONSTANTS } from "../types/config.js";
import { normalizeToken } from "./tokenUtils.js";
export async function requestRefreshToken(refreshToken) {
    if (!refreshToken)
        return undefined;
    const req = await fetch("https://auth.portaleargo.it/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            scope: ARGO_CONSTANTS.scopes,
            client_id: ARGO_CONSTANTS.clientId,
            redirect_uri: ARGO_CONSTANTS.callback,
        }).toString(),
    });
    if (!req.ok)
        return undefined;
    const raw = await req.text();
    if (!raw.trim())
        return undefined;
    let data;
    try {
        data = JSON.parse(raw);
    }
    catch {
        return undefined;
    }
    const token = normalizeToken(data);
    return token ?? undefined;
}
