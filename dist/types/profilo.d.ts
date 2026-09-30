export interface APIProfilo {
    /** Indica se la password è da resettare o no */
    resetPassword: boolean;
    /** Ultimo cambio password (YYYY-MM-DD) — solo vecchia base, assente sulla nuova */
    ultimoCambioPwd?: string;
    /**
     * @deprecated Alias storico, il server invia `ultimoCambioPwd`.
     */
    ultimoCambioPassword?: string;
    /** Informazioni sull'anno scolastico corrente */
    anno: {
        /** Data di inizio dell'anno scolastico (YYYY-MM-DD) */
        dataInizio: string;
        /** Anno (YYYY) — numero sulla vecchia base, stringa sulla nuova */
        anno: number | string;
        /** Data di fine dell'anno scolastico (YYYY-MM-DD) */
        dataFine: string;
    };
    /** Duplicato di `anno` inviato solo dalla nuova base */
    annoCorrente?: {
        dataInizio: string;
        anno: number | string;
        dataFine: string;
    };
    /** Informazioni sul genitore */
    genitore: {
        /** Email del genitore (vecchia base) */
        email?: string;
        /** Email del genitore (nuova base, con M maiuscola) */
        desEMail?: string;
        /** `COGNOME NOME` del genitore */
        nominativo: string;
        /** Codice di identificazione del genitore (vecchia base) */
        pk?: string;
        /** Codice di identificazione del genitore (nuova base) */
        genitorePK?: string;
    };
    /** Profilo disabilitato */
    profiloDisabilitato: boolean;
    /** Profilo SPID o no */
    isSpid: boolean;
    /** Informazioni sull'alunno */
    alunno: {
        /** Indica se è l'ultima classe dell'alunno o no */
        ultimaClasse: boolean;
        /** `COGNOME NOME` dell'alunno */
        nominativo: string;
        /** Cognome dell'alunno */
        cognome: string;
        /** Nome dell'alunno */
        nome: string;
        /** Codice di identificazione dell'alunno (vecchia base) */
        pk?: string;
        /** Codice di identificazione dell'alunno (nuova base) */
        alunnoPK?: string;
        /** Indica se è maggiorenne o no */
        maggiorenne: boolean;
        /** Email dell'alunno */
        email: string;
    };
    /** Contiene diverse informazioni sulla scuola e sulla classe */
    scheda: {
        /** Contiene informazioni sulla classe */
        classe: {
            /** Codice di identificazione della classe */
            pk: string;
            /** Anno scolastico (1,2,3,4,5) */
            desDenominazione: string;
            /** Sezione */
            desSezione: string;
        };
        /** Contiene informazioni sull'indirizzo scolastico/corso */
        corso: {
            /**
             * Descrizione del corso
             * @example "LICEO SCIENTIFICO OPZ SCIENZE APPLICATE"
             */
            descrizione: string;
            /** Codice di identificazione del corso */
            pk: string;
        };
        /** Informazioni sulla sede */
        sede: {
            /** Codice meccanografico della scuola */
            descrizione: string;
            /** Codice di identificazione della sede */
            pk: string;
        };
        /** Informazioni sulla scuola */
        scuola: {
            /** Dato sconosciuto, magari ordine (Statale/Privata), in esempi è `S` */
            desOrdine: string;
            /** "Descrizione" (nome) della scuola */
            descrizione: string;
            /** Codice di identificazione della scuola */
            pk: string;
        };
        /** Codice di identificazione della scheda? */
        pk: string;
        /** Anno (solo nuova base) */
        anno?: number;
        /** Flag (solo nuova base) */
        aggiornaSchedaPK?: boolean;
    };
    /** Primo accesso */
    primoAccesso: boolean;
    /** Profilo storico (sconosciuto) */
    profiloStorico: boolean;
}
export interface Profilo {
    /** Mobile token del profilo */
    token: string;
    /** Primo accesso */
    isPrimoAccesso: boolean;
    /** Profilo disabilitato */
    profiloDisabilitato: boolean;
    /** Indica se la password è da resettare o no */
    isResetPassword: boolean;
    /** Indica se l'accesso è stato fatto via SPID o no */
    isSpid: boolean;
    /** Nome dell'alunno */
    nome: string;
    /** Cognome dell'alunno */
    cognome: string;
}
/** Profilo + mobile token come restituito da `getProfili()` / `selectUser()`. */
export interface ProfiloSelezionato {
    profilo: APIProfilo;
    token: string;
}
