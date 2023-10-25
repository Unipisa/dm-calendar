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

Il progetto è impostato in modo tale che vengono generati due file [`./out/lib/dm-calendar.js`](https://unipisa.github.io/dm-calendar/lib/dm-calendar.js) e [`./out/lib/dm-calendar.css`](https://unipisa.github.io/dm-calendar/lib/dm-calendar.css), il file in js esporta un'unica funzione `createCalendar($el, options)`.

Un esempio di utilizzo si trova in [`./src/main.js`](./src/main.js), comunque si può partire da questo esempio

```js
import { createCalendar } from './dm-calendar'

createCalendar(document.querySelector('.dm-calendar'), {
    async queryEvents({ from, to }) {
        ...
    },
})
```

La funzione `queryEvents` deve ritornare una lista di eventi con i seguenti campi

```ts
type Event = {
    title: string
    start: Date | string
    end: Date | string

    // imposta questo evento come "tutta la giornata"
    allDay?: boolean
    // imposta un url per questo evento, rendendolo un link cliccabile
    url?: string
}
```

### Usage: Link & Script Tag

```html
<link rel="stylesheet" href="https://unipisa.github.io/dm-calendar/lib/dm-calendar.css">

...

<!-- import using module syntax -->
<script type="module">
    import { createCalendar } from 'https://unipisa.github.io/dm-calendar/lib/dm-calendar.js'
    ...
    createCalendar($el, options)
</script>

...

<!-- old style direct global import -->
<script src="https://unipisa.github.io/dm-calendar/lib/dm-calendar.iife.js"></script>
<script>
    DMCalendar.createCalendar($el, options)
</script>
```

## Notes

#### Comandi per generare i dati di prova 

Il cookie preso dalla sessione del browser, `jq` è usato solo per formattare il json e renderlo leggibile

```bash shell
curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-phd-course?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/phd-courses.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-seminar?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/seminars.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-conference?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/conferences.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/conference-room?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/conference-rooms.json
```
