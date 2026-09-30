export const ARGO_CONSTANTS = {
    baseApiURL: "https://didattica.portaleargo.it/famiglia/api",
    clientId: "72fd6dea-d0ab-4bb9-8eaa-3ac24c84886c",
    scopes: "openid offline profile user.roles argo",
    callback: "it.argosoft.didup.famiglia.new://login-callback",
    fcmClientId: "d8MtQX5fR3yS9I7k-5OXUs:APA91bErrU-H7wGQ8yLastE_xS2JHDrVrfReRY2mnWQ9aVd-ohWYDTSLVRrKUsO2-25mBN1aduh5sPnZjFstg0Ixqiuoh5wCC38BB6NEveqWI_d6ZpM5DN3nvyVS8vDtwLS9caWeCmEK",
    // Hack per evitare che il server rifiuti la richiesta a causa di una versione obsoleta di argo.
    clientVersion: "9.99.9",
} as const;

export const utilities = ARGO_CONSTANTS;
export type ArgoConstants = typeof ARGO_CONSTANTS;
