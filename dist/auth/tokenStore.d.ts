import type { Token } from "../types/token.js";
export interface AccountCredentials {
    codice_scuola: string;
    username: string;
    password: string;
}
export interface TokenStoreOptions {
    dir: string;
    codiceScuola: string;
    username: string;
    enabled: boolean;
}
export declare class FileTokenStore {
    private memory;
    private readonly dir;
    private readonly codiceScuola;
    private readonly username;
    enabled: boolean;
    constructor(opts: TokenStoreOptions);
    get token(): Token | null;
    set token(t: Token | null);
    get filePath(): string;
    load(): Promise<Token | null>;
    save(token: Token): Promise<void>;
    clear(): Promise<void>;
}
