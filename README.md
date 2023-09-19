# ArgoScuola.js

Una libreria JavaScript con supporto per TypeScript che permette di interfacciarsi con le API del portale famiglia di Argo DidUP

## LA LIBRERIA NON E' COMPLETA!!

Devo ancora implementare i mobile token (gli utenti), perciò richieste come getDashboard() potrebbero non funzionare.

Il login funziona correttamente, quindi è possibile ottenere l'access/refresh token e refresharlo automaticamente quando viene fatta una nuova richiesta o quando il client prova a ri-loggare.

## Piccoli esempi per chi la volesse provare

```js
// Importa argoscuola.js
import { ArgoClient } from 'argoscuola.js'

// Inizializza l'ArgoClient
const client = new ArgoClient("codiceScuola", "username", "password")

// Fai il login 
await client.login()

// Seleziona il profilo
await client.argo.selectUser("Nome", "Cognome")

// Fai le tue richieste (es. dashboard)

// E' suggerito chiamare aggiornaData() per assicurati di prendere i dati più recenti
await client.argo.aggiornaData(new Date(Date.now()))

const dashboard = await client.argo.getDashboard()
```