import { promises as fs } from "fs";
import path from "path";
import { normalizeToken } from "./tokenUtils.js";
function sanitizeFilePart(value) {
    const cleaned = value.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 64);
    return cleaned || "user";
}
export class FileTokenStore {
    memory = null;
    dir;
    codiceScuola;
    username;
    enabled;
    constructor(opts) {
        this.dir = opts.dir;
        this.codiceScuola = opts.codiceScuola;
        this.username = opts.username;
        this.enabled = opts.enabled;
    }
    get token() {
        return this.memory;
    }
    set token(t) {
        this.memory = t;
    }
    get filePath() {
        return path.join(this.dir, `${sanitizeFilePart(this.codiceScuola)}_${sanitizeFilePart(this.username)}.json`);
    }
    async load() {
        if (!this.enabled)
            return this.memory;
        try {
            const raw = await fs.readFile(this.filePath, "utf8");
            const parsed = JSON.parse(raw);
            const token = normalizeToken(parsed);
            this.memory = token;
            return token;
        }
        catch {
            return null;
        }
    }
    async save(token) {
        this.memory = token;
        if (!this.enabled)
            return;
        await fs.mkdir(this.dir, { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(token), "utf8");
    }
    async clear() {
        this.memory = null;
        if (!this.enabled)
            return;
        try {
            await fs.rm(this.filePath, { force: true });
        }
        catch {
        }
    }
}
