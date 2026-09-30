import type { AccountCredentials, FileTokenStore } from "./tokenStore.js";
import type { Token } from "../types/token.js";
import { isTokenExpired } from "./tokenUtils.js";

export interface AuthServiceDeps {
    credentials: AccountCredentials;
    tokenStore: FileTokenStore;
    fetchFreshToken: (creds: AccountCredentials) => Promise<Token>;
    requestRefreshToken: (refreshToken: string) => Promise<Token | undefined>;
    validateToken: () => Promise<boolean>;
}

export class AuthService {
    private readonly deps: AuthServiceDeps;

    constructor(deps: AuthServiceDeps) {
        this.deps = deps;
    }

    async login(): Promise<Token> {
        const { credentials, tokenStore } = this.deps;

        if (!tokenStore.enabled) {
            const fresh = await this.deps.fetchFreshToken(credentials);
            tokenStore.token = fresh;
            return fresh;
        }

        let cached = tokenStore.token ?? (await tokenStore.load());

        if (!cached) {
            const fresh = await this.deps.fetchFreshToken(credentials);
            await tokenStore.save(fresh);
            return fresh;
        }

        if (isTokenExpired(cached)) {
            const refreshed = await this.deps.requestRefreshToken(cached.refresh_token).catch(() => undefined);
            if (refreshed) {
                await tokenStore.save(refreshed);
                cached = refreshed;
            } else {
                const fresh = await this.deps.fetchFreshToken(credentials);
                await tokenStore.save(fresh);
                return fresh;
            }
        } else {
            tokenStore.token = cached;
        }

        const valid = await this.deps.validateToken().catch(() => false);
        if (!valid) {
            const fresh = await this.deps.fetchFreshToken(credentials);
            await tokenStore.save(fresh);
            return fresh;
        }

        return tokenStore.token ?? cached;
    }

    async refreshOrRelogin(): Promise<Token> {
        const { credentials, tokenStore } = this.deps;
        const current = tokenStore.token;
        if (current?.refresh_token) {
            const refreshed = await this.deps.requestRefreshToken(current.refresh_token).catch(() => undefined);
            if (refreshed) {
                await tokenStore.save(refreshed);
                return refreshed;
            }
        }
        const fresh = await this.deps.fetchFreshToken(credentials);
        await tokenStore.save(fresh);
        return fresh;
    }
}
