import rawEvents from './samples/phd-courses.json'

import { createCalendar } from './dm-calendar'

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

document.addEventListener('DOMContentLoaded', () => {
    createCalendar(document.querySelector('.dm-calendar'), {
        async queryEvents({ from, to } = {}) {
            console.log('Trying to load more events', from, to)

            from ??= MIN_DATE
            to ??= MAX_DATE

            // TODO: process rawEvents...

            return [
                ...rawEvents.data.flatMap(({ title, lessons }) => {
                    return lessons.map(({ date, duration }) => ({
                        title,
                        start: date,
                        end: new Date(new Date(date).getTime() + duration * 1000 * 60),
                    }))
                }),
            ]
        },
    })
})
