/**
 * Mantenuto esclusivamente per compatibilità, importa i tipi dai file stessi (e.g. `import { Token } from "./token.js"`).
 */
export type { Token } from "./token.js";
export type { OpenIDConfiguration } from "./openid.js";
export type { HttpMethod, ArgoRequestHeaders } from "./http.js";
export { ARGO_CONSTANTS, utilities } from "./config.js";
export type { ArgoConstants } from "./config.js";
export type { ArgoClientOptions } from "./options.js";
export type {
    FuoriClasse,
    MateriaInfo,
    Periodo,
    Promemoria,
    BachecaAllegato,
    BachecaItem,
    FileCondivisi,
    MateriaLight,
    Voto,
    DocenteClasse,
    BachecaAlunnoItem,
    MediaPeriodo,
    MediaMateria,
    Compito,
    RegistroEntry,
    AppelloEvento,
    DashboardData,
    DashboardOpzione,
    APIDashboard,
    WhatAlunno,
    WhatScheda,
    WhatDati,
    APIWhat,
    WhatDateInput,
    GetWhatOptions,
} from "./dashboard.js";
export type { APIProfilo, Profilo, ProfiloSelezionato } from "./profilo.js";
