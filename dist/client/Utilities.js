import { formatArgoDate } from "../auth/tokenUtils.js";
import { requestRefreshToken } from "../auth/refreshToken.js";
export class Utilities {
    getRefreshToken;
    constructor(getRefreshToken) {
        this.getRefreshToken = getRefreshToken ?? (() => "");
    }
    /**
     * Funzione utile per formattare la data di ultimo aggiornamento
     * @param data Data da formattare
     * @returns {string} `YYYY-MM-DD HH:mm:ss`
     */
    formattaDataUltimoAggiornamento(data) {
        return formatArgoDate(data);
    }
    async requestRefreshToken() {
        return requestRefreshToken(this.getRefreshToken());
    }
}
export { formatArgoDate };
