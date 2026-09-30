import type { Token } from "../types/token.js";
export declare function isTokenExpired(token: Pick<Token, "expires_at"> | null | undefined, now?: number, expiryMarginMs?: number): boolean;
export declare function toExpiresAtHeaderValue(expiresAt: Token["expires_at"]): string;
export declare function normalizeToken(raw: unknown): Token | null;
export declare function emptyToken(): Token;
export declare function formatArgoDate(date: Date): string;
