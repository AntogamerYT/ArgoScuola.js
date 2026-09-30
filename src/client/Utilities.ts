import { formatArgoDate } from "../auth/tokenUtils.js";
import { requestRefreshToken } from "../auth/refreshToken.js";
import type { Token } from "../types/token.js";

export class Utilities {
    private readonly getRefreshToken: () => string;

    constructor(getRefreshToken?: () => string) {
        this.getRefreshToken = getRefreshToken ?? (() => "");
    }

    /**
     * Funzione utile per formattare la data di ultimo aggiornamento
     * @param data Data da formattare
     * @returns {string} `YYYY-MM-DD HH:mm:ss`
     */
    public formattaDataUltimoAggiornamento(data: Date): string {
        return formatArgoDate(data);
    }

    public async requestRefreshToken(): Promise<Token | undefined> {
        return requestRefreshToken(this.getRefreshToken());
    }
}

export { formatArgoDate };
