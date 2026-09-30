import type { Token } from "../types/token.js";

export function isTokenExpired(
    token: Pick<Token, "expires_at"> | null | undefined,
    now: number = Date.now(),
    expiryMarginMs = 30000,
): boolean {
    if (!token?.expires_at) return true;
    const t = new Date(token.expires_at).getTime();
    if (Number.isNaN(t)) return true;
    return t - expiryMarginMs < now;
}

export function toExpiresAtHeaderValue(expiresAt: Token["expires_at"]): string {
    if (!expiresAt) return new Date().toISOString();
    const d = new Date(expiresAt);
    if (Number.isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
}

export function normalizeToken(raw: unknown): Token | null {
    if (typeof raw !== "object" || raw === null) return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.access_token !== "string" || !r.access_token) return null;
    if (typeof r.refresh_token !== "string") return null;

    let expiresAt: Date | string | undefined;
    if (r.expires_at !== undefined) {
        const d = new Date(r.expires_at as string);
        if (Number.isNaN(d.getTime())) return null;
        expiresAt = d;
    } else if (typeof r.expires_in === "number") {
        expiresAt = new Date(Date.now() + r.expires_in * 1000);
    } else {
        return null;
    }

    return {
        access_token: r.access_token,
        expires_at: expiresAt,
        id_token: typeof r.id_token === "string" ? r.id_token : "",
        refresh_token: r.refresh_token,
        scope: typeof r.scope === "string" ? r.scope : "",
        token_type: typeof r.token_type === "string" ? r.token_type : "bearer",
    };
}

export function emptyToken(): Token {
    return {
        access_token: "",
        expires_at: undefined,
        id_token: "",
        refresh_token: "",
        scope: "",
        token_type: "bearer",
    };
}

export function formatArgoDate(date: Date): string {
    if (Number.isNaN(date.getTime())) throw new Error("Data non valida: " + date);
    const iso = date.toISOString();
    const [day, timeWithMs] = iso.split("T");
    const time = timeWithMs.split(".")[0];
    return `${day} ${time}`;
}
