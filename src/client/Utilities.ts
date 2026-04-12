import { Token, utilities } from "../types/Types.js";
import { ArgoClient } from "./ArgoClient.js";


export class Utilities {
    private client: ArgoClient;

    constructor(client: ArgoClient) {
        this.client = client;
    }

    /**
     * Funzione utile per formattare la data di ultimo aggiornamento
     * @param data Data da formattare
     * @returns {string}
     */
    public formattaDataUltimoAggiornamento(data: Date): string {
        return data.toISOString().split("T")[0] + " " + data.toISOString().split("T")[1].split(".")[0];
    }

    public async requestRefreshToken(): Promise<Token | undefined> {
        const req = await fetch("https://auth.portaleargo.it/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                refresh_token: this.client.token.refresh_token,
                grant_type: "refresh_token",
                scope: utilities.scopes,
                client_id: utilities.clientId,
                redirect_uri: utilities.callback
            }).toString()
        })

        if (!req.ok) return undefined;

        const rawResponse = await req.text();
        if (!rawResponse.trim()) return undefined;

        let data: any;
        try {
            data = JSON.parse(rawResponse);
        } catch {
            return undefined;
        }

        if (!data.access_token || !data.expires_in) return undefined;

        data.expires_at = new Date(Date.now() + data.expires_in * 1000);
        delete data.expires_in;

        return data as Token;
    }
}