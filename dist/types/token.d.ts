export interface Token {
    access_token: string;
    expires_at: Date | string | undefined;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    /** expires_in dalla risposta OAuth, viene poi normalizzato in `expires_at` */
    expires_in?: number;
}
