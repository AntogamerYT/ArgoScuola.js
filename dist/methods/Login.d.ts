import { Token, OpenIDConfiguration } from "../types/Types.js";
export declare function getAccessToken(codScuola: string, username: string, password: string): Promise<Token>;
export declare function getOpenIDConf(): Promise<OpenIDConfiguration>;
export declare function generatePkce(): {
    code_challenge: string;
    code_verifier: string;
};
