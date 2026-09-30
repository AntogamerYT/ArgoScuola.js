import { promises as fs } from "fs";
import path from "path";
import type { Token } from "../types/token.js";
import { normalizeToken } from "./tokenUtils.js";

export interface AccountCredentials {
    codice_scuola: string;
    username: string;
    password: string;
}

function sanitizeFilePart(value: string): string {
    const cleaned = value.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 64);
    return cleaned || "user";
}

export interface TokenStoreOptions {
    dir: string;
    codiceScuola: string;
    username: string;
    enabled: boolean;
}

export class FileTokenStore {
    private memory: Token | null = null;
    private readonly dir: string;
    private readonly codiceScuola: string;
    private readonly username: string;
    enabled: boolean;

    constructor(opts: TokenStoreOptions) {
        this.dir = opts.dir;
        this.codiceScuola = opts.codiceScuola;
        this.username = opts.username;
        this.enabled = opts.enabled;
    }

    get token(): Token | null {
        return this.memory;
    }

    set token(t: Token | null) {
        this.memory = t;
    }

    get filePath(): string {
        return path.join(
            this.dir,
            `${sanitizeFilePart(this.codiceScuola)}_${sanitizeFilePart(this.username)}.json`,
        );
    }

    async load(): Promise<Token | null> {
        if (!this.enabled) return this.memory;
        try {
            const raw = await fs.readFile(this.filePath, "utf8");
            const parsed: unknown = JSON.parse(raw);
            const token = normalizeToken(parsed);
            this.memory = token;
            return token;
        } catch {
            return null;
        }
    }

    async save(token: Token): Promise<void> {
        this.memory = token;
        if (!this.enabled) return;
        await fs.mkdir(this.dir, { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(token), "utf8");
    }

    async clear(): Promise<void> {
        this.memory = null;
        if (!this.enabled) return;
        try {
            await fs.rm(this.filePath, { force: true });
        } catch {
        }
    }
}
