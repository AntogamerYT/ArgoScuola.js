import { formatArgoDate } from "../auth/tokenUtils.js";
import type { Token } from "../types/token.js";
export declare class Utilities {
    private readonly getRefreshToken;
    constructor(getRefreshToken?: () => string);
    /**
     * Funzione utile per formattare la data di ultimo aggiornamento
     * @param data Data da formattare
     * @returns {string} `YYYY-MM-DD HH:mm:ss`
     */
    formattaDataUltimoAggiornamento(data: Date): string;
    requestRefreshToken(): Promise<Token | undefined>;
}
export { formatArgoDate };
