# ArgoScuola.js

Una libreria JavaScript con supporto per TypeScript che permette di interfacciarsi con le API del portale famiglia di Argo DidUP

## LA LIBRERIA NON E' COMPLETA!!

Mancano ancora molti endpoint da implementare

I mobile token sono implementati, perciò sarà possibile fare richieste come Argo#getDashboard() affinchè venga selezionato un profilo con Argo#selectUser()

Il login funziona correttamente, quindi è possibile ottenere l'access/refresh token e refresharlo automaticamente quando viene fatta una nuova richiesta o quando il client prova a ri-loggare.

## Piccoli esempi per chi la volesse provare

```js
// Importa argoscuola.js
import { ArgoClient } from 'argoscuola.js'

// Inizializza l'ArgoClient
const client = new ArgoClient({
    codScuola: "ab12345",
    username: "anto",
    password: "no",
    // dati opzionali
    configPath: "./argo",
    saveLogins: true
})

// Fai il login 
await client.login()

// Seleziona il profilo
await client.argo.selectUser("Nome", "Cognome")

// Fai le tue richieste (es. dashboard)

// E' suggerito chiamare aggiornaData() per assicurati di prendere i dati più recenti
await client.argo.aggiornaData(new Date(Date.now()))

const dashboard = await client.argo.getDashboard()
```
