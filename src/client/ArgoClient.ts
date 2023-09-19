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
    debug: boolean;
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
    * @param debug Abilita log di debug (defaulta a false)
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
    constructor(codScuola: string, username: string, password: string, debug?: boolean | undefined, configPath?: string) {
        this.accountCredentials.codice_scuola = codScuola;
        this.accountCredentials.username = username;
        this.accountCredentials.password = password;
        this.configPath = configPath ?? './.argo/';
        this.debug = debug || false;

    }


    public async login() {

        if (!fs.existsSync(this.configPath)) {
            fs.mkdirSync(this.configPath);
            this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
            fs.writeFileSync(this.configPath + "token.json", JSON.stringify(this.token));
        } else {
            if (fs.existsSync(this.configPath + "token.json")) {
                this.token = JSON.parse(fs.readFileSync(this.configPath + "token.json", "utf8"));
                if (this.token.expires_at && new Date(this.token.expires_at).getTime() < new Date().getTime()) {
                    const newToken = await this.utilities.requestRefreshToken();
                    if (!newToken) {
                        this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                        fs.writeFileSync(this.configPath + "token.json", JSON.stringify(this.token));
                    }
                }
                if (!await this.attemptAccessToken()) {
                    this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                    fs.writeFileSync(this.configPath + "token.json", JSON.stringify(this.token));
                }
            } else {
                this.token = await getAccessToken(this.accountCredentials.codice_scuola, this.accountCredentials.username, this.accountCredentials.password);
                fs.writeFileSync(this.configPath + "token.json", JSON.stringify(this.token));
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

