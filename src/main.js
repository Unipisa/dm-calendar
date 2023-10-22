import rawEvents from './samples/phd-courses.json'

import { createCalendar } from './dm-calendar'

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

document.addEventListener('DOMContentLoaded', () => {
    createCalendar(document.querySelector('.dm-calendar'), {
        async queryEvents({ from, to }) {
            console.log('Trying to load more events', from, to)

            from ??= MIN_DATE
            to ??= MAX_DATE

            // TODO: process rawEvents...

            return [
                ...rawEvents.data.flatMap(phdCourse => {
                    return phdCourse.lessons.map(lesson => ({
                        title: phdCourse.title,
                        start: lesson.date,
                        end: new Date(new Date(lesson.date).getTime() + lesson.duration * 1000 * 60),
                        extendedProps: { phdCourse, lesson },
                    }))
                }),
            ]
        },
    })
})
