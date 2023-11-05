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
import { DMCalendar } from './element.jsx'

render(
    <DMCalendar
        endpoint="https://manage.dm.unipi.it/"
        queryEvents={async queryEvents({ from, to }) {
            ...
        }}
    />,
    document.querySelector('.calendar-container')
)
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

### Usage: Script Tag & WebComponent

```html
<script src="https://unipisa.github.io/dm-calendar/lib/dm-calendar-element.iife.js"></script>

<dm-calendar
    endpoint="https://manage.dm.unipi.it/"
    includes="phd-courses seminar-category=ID1 seminar-category=ID2 ..."></dm-calendar>
```

### Usage: WordPress Shortcode

```php
<?php

wp_register_script('dm-calendar', 'https://unipisa.github.io/dm-calendar/lib/dm-calendar-element.iife.js');

function calendar_shortcode( $atts ) {
    wp_enqueue_script('dm-calendar');
    return <<<EOF
    <dm-calendar
        endpoint="https://manage.dm.unipi.it"
        includes="phd-courses seminar-category=ID1 ..."></dm-calendar>
    EOF;
}

add_shortcode('event_calendar', 'calendar_shortcode');
```

## Notes

#### Comandi per generare i dati di prova 

Il cookie preso dalla sessione del browser, `jq` è usato solo per formattare il json e renderlo leggibile

```bash shell
# Direct model data

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-phd-course?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/phd-courses.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-seminar?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/seminars.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-conference?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/conferences.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/conference-room?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/conference-rooms.json

# Public endpoints

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/public/lessons?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/lessons.json

curl -s 'https://manage.develop.lb.cs.dm.unipi.it/api/v0/public/seminars?_limit=9999' -H 'Authorization: Bearer ...' \
| jq > src/samples/seminars.json
```
