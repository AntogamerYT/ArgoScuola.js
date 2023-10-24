import fs from 'fs'
import { getAccessToken } from '../methods/Login.js';
import { HttpMethod, Token, utilities } from '../types/Types.js';
import { sendArgoRequest } from '../http/http.js';
import { Utilities } from './Utilities.js';
import { Argo } from './Argo.js';

export class ArgoClient {
    accountCredentials: {
        codice_scuola: string;
        username: string;
        password: string;
    } = {
            codice_scuola: "",
            username: "",
            password: ""
        }
    configPath: string;
    //readonly debugEvent: (message: string) => void = () => { };
    saveLogin: boolean = true;
    dataAggiornaData = "";
    token: Token = { access_token: "", expires_at: undefined, id_token: "", refresh_token: "", scope: "openid offline profile user.roles argo", token_type: "bearer" };
    utilities = new Utilities(this);
    argo = new Argo(this);

    /**
    * @param opzioni prese da ArgoClientOptions
    * @param codScuola Codice scuola
    * @param username Username argo
    * @param password Password del profilo
    * @param configPath Percorso del file di configurazione da salvare (contiene access token e refresh token) (default: ./.argo/)
    * @param saveLogin Se true, salva i dati di login in un file di configurazione (default: true)
    * @example
    * ```js
    * import { ArgoClient } from "ArgoScuola.js";
    * const client = new ArgoClient({
    *    codScuola: "AB12345",
    *    username: "utente",
    *    password: "LaMiaPassword",
    *   });
    * ```
    */
    constructor(opzioni: {
        codScuola: string;
        username: string;
        password: string;
        //debugEvent?: (message: string) => void;
        configPath?: string;
        saveLogin?: boolean;
    }) {
        this.accountCredentials.codice_scuola = opzioni.codScuola;
        this.accountCredentials.username = opzioni.username;
        this.accountCredentials.password = opzioni.password;
        this.configPath = opzioni.configPath ?? './.argo/';
        //this.debugEvent = opzioni.debugEvent ?? (() => { });

    }


    public async login() {
        if (!this.saveLogin) {
            //this.debugEvent("Il salvataggio del login é disabilitato, login in corso (verrà creata una nuova sessione al relogin)...");
            this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
            return;
        }

        if (!fs.existsSync(this.configPath)) {
            this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
            fs.mkdirSync(this.configPath);
            //this.debugEvent(`${this.configPath} creato`);
            fs.writeFileSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`, JSON.stringify(this.token));
            //this.debugEvent(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json creato`);
        } else {
            if (fs.existsSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`)) {
                this.token = JSON.parse(fs.readFileSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`, "utf8"));
                if (this.token.expires_at && new Date(this.token.expires_at).getTime() < new Date().getTime()) {
                    //this.debugEvent("L'access token é scaduto, richiesta di un nuovo access token in corso...");
                    const newToken = await this.utilities.requestRefreshToken();
                    if (!newToken) {
                        //this.debugEvent("Il refresh token é scaduto, relogin in corso...");
                        this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                        fs.writeFileSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`, JSON.stringify(this.token));
                    }
                }
                if (!await this.attemptAccessToken()) {
                    
                    this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                    fs.writeFileSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`, JSON.stringify(this.token));
                }
            } else {
                //this.debugEvent(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json non esiste, login in corso...`);
                this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                fs.writeFileSync(`${this.configPath}${this.accountCredentials.codice_scuola}${this.accountCredentials.username}.json`, JSON.stringify(this.token));
            }
        }
    }



    public async sendArgoRequest(path: string, method: HttpMethod, parseBody: boolean = true, body?: string, headers?: any) {
        return await sendArgoRequest(this, path, method, parseBody, body, headers);
    }

    public async getProfile() {
        const req = await sendArgoRequest(this, "/profilo", "GET", true);
        return req.response;
    }


    private async attemptAccessToken() {
        const req = await this.sendArgoRequest("/login", "POST", false, JSON.stringify({
            "lista-opzioni-notifiche": "{}",
            "lista-x-auth-token": "[]",
            clientID: "d8MtQX5fR3yS9I7k-5OXUs:APA91bErrU-H7wGQ8yLastE_xS2JHDrVrfReRY2mnWQ9aVd-ohWYDTSLVRrKUsO2-25mBN1aduh5sPnZjFstg0Ixqiuoh5wCC38BB6NEveqWI_d6ZpM5DN3nvyVS8vDtwLS9caWeCmEK"
        }))

        if (req.status === 401) return false;

        return true;
    }


}

