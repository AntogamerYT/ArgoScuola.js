export type ArgoClientOptions = {
    /**
     * Codice scuola
     */
    codScuola: string;
    /**
     * Username argo
     */
    username: string;
    /**
     * Password del profilo
     */
    password: string;
    /**
     * Percorso della cartella di configurazione (contiene access token e refresh token) (default: ./.argo/)
     */
    configPath?: string;
    /**
     * Se true, salva i dati di login in un file di configurazione (default: true)
     */
    saveLogin?: boolean;
};
