import type { AccountCredentials, FileTokenStore } from "./tokenStore.js";
import type { Token } from "../types/token.js";
export interface AuthServiceDeps {
    credentials: AccountCredentials;
    tokenStore: FileTokenStore;
    fetchFreshToken: (creds: AccountCredentials) => Promise<Token>;
    requestRefreshToken: (refreshToken: string) => Promise<Token | undefined>;
    validateToken: () => Promise<boolean>;
}
export declare class AuthService {
    private readonly deps;
    constructor(deps: AuthServiceDeps);
    login(): Promise<Token>;
    refreshOrRelogin(): Promise<Token>;
}
