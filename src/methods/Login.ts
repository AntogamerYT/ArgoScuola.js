import base64url from "base64url";
import randomstring from "randomstring";
import crypto from 'crypto'
import fetchCookie from "fetch-cookie";
import { Token, OpenIDConfiguration, utilities } from "../types/Types.js";
const state = "ZLPj9-219_GcjcEQFkni3g" // Stringa casuale generata dall'app, bisogna vedere se ha un significato per il server o no
const nonce = "3_vCenrhSmCaUDcV_70Bvg" // Abbinato con l'id token controlla se la richiesta è stata mandata in quella occasione per evitare replay attack, è molto probabilmente una stringa casuale
const HTTPInstance = fetchCookie(fetch)

export async function getAccessToken(codScuola: string, username: string, password: string): Promise<Token> {
    const { authorization_endpoint, token_endpoint } = await getOpenIDConf();

    const { code_challenge, code_verifier } = generatePkce();
    const queryStringAuth = `?redirect_uri=${encodeURIComponent(utilities.callback)}&client_id=${utilities.clientId}&response_type=code&prompt=login&state=${state}&nonce=${nonce}&scope=${encodeURIComponent(utilities.scopes)}&code_challenge=${code_challenge}&code_challenge_method=S256`

    const authUrl = `${authorization_endpoint}${queryStringAuth}`;
    const authRes = await HTTPInstance(authUrl, {
        method: "GET",
        redirect: "manual",
    });

    const challenge = authRes.headers.get("Location")?.replace("https://www.portaleargo.it/auth/sso/login/?login_challenge=", "");

    const loginPayload = new URLSearchParams({
        challenge: challenge!,
        client_id: utilities.clientId,
        prefill: "false",
        famiglia_customer_code: codScuola!,
        username: username!,
        password: password!,
        login: "true",
    }).toString();

    const loginRes = await HTTPInstance("https://www.portaleargo.it/auth/sso/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: loginPayload,
        redirect: "manual"
    });

    if ((await loginRes.text()).includes("Username e/o password non validi")) throw new Error("Le credenziali inserite non sono valide.")

    const secondLoginRes = await HTTPInstance(loginRes.headers.get("Location")!, {
        method: "GET",
        redirect: "manual"
    });

    const oauthConsentRes = await HTTPInstance(secondLoginRes.headers.get("Location")!, {
        method: "GET",
        redirect: "manual"
    });


    const finalLoginRes = await HTTPInstance(oauthConsentRes.headers.get("Location")!, {
        method: "GET",
        redirect: "manual"
    });

    const finalLoginURL = new URL(finalLoginRes.headers.get("Location")!);

    const finalLoginSearchParams = finalLoginURL.searchParams;

    const tokenResBody = new URLSearchParams({
        client_id: utilities.clientId!,
        code: finalLoginSearchParams.get("code")!,
        redirect_uri: utilities.callback,
        code_verifier,
        grant_type: "authorization_code",
    }).toString()

    const tokenRes = await HTTPInstance(token_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: tokenResBody,
    });
    const tokenData = await tokenRes.json();
    tokenData.expires_at = new Date(Date.now() + tokenData.expires_in * 1000);
    delete tokenData.expires_in;

    return tokenData as Token;
}


export async function getOpenIDConf(): Promise<OpenIDConfiguration> {
    const res = await fetch("https://auth.portaleargo.it/.well-known/openid-configuration")
    return await res.json()
}

export function generatePkce() {
    const code_verifier = randomstring.generate(128);

    const base64Digest = crypto
        .createHash("sha256")
        .update(code_verifier)
        .digest("base64");

    const code_challenge = base64url.fromBase64(base64Digest);

    return { code_challenge, code_verifier };
}