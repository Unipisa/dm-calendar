# Calendario DM

Widget calendario per il sito del dipartimento

## Setup

```bash
# Install all dependencies
$ npm install
```

## Development

```bash
# Start the development server
$ npm run dev
```

## Deployment

Il progetto può essere costruito con

```bash
# Build the project
$ npm run build
```

Il progetto è impostato in modo tale che vengono generati due file `./out/dm-calendar.js` e `./out/dm-calendar.css`, il file in js esporta un'unica funzione `createCalendar(mountElement, options)`.

Un esempio di utilizzo si trova in [`./src/main.js`](./src/main.js) comunque in breve basta partire da questo

```js
import { createCalendar } from './dm-calendar'

createCalendar(document.querySelector('.dm-calendar'), {
    async queryEvents({ from, to } = {}) {
        ...
    },
})
```

La funzione `queryEvents` deve ritornare una lista di eventi con i seguenti campi

- `title : string` &mdash; titolo dell'evento

- `start : Date | string` &mdash; data di inizio dell'evento

- `end : Date | string` &mdash; data di fine dell'evento

- `allDay : boolean` (opzionale) &mdash; imposta questo evento come "tutta la giornata"

- `url : string` (opzionale) &mdash; imposta un url per questo evento che rende l'evento un link a questo url

## Notes

#### Comandi per generare i dati di prova 

Il cookie preso dalla sessione del browser, `jq` è usato solo per formattare il json e renderlo leggibile

```bash shell
curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-phd-course?_limit=9999' -H 'cookie: connect.sid=...' \
| jq > phd-courses.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-seminar?_limit=9999' -H 'cookie: connect.sid=...' \
| jq > seminars.json
```