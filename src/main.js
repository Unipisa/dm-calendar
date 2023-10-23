import rawConferenceRooms from './samples/conference-rooms.json'
import rawEvents from './samples/phd-courses.json'

import _ from 'lodash'

import { createCalendar } from './dm-calendar'

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

const conferenceRooms = _.keyBy(rawConferenceRooms.data, '_id')

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
                        extendedProps: {
                            phdCourse,
                            lesson: {
                                ...lesson,
                                conferenceRoom: conferenceRooms[lesson.conferenceRoom],
                            },
                        },
                    }))
                }),
            ]
        },
        customTooltip({ extendedProps: { phdCourse, lesson } }) {
            return `
                <div class="title">
                    ${phdCourse.title}
                </div>
                <div>
                    <strong>Aula:</strong>
                    ${lesson.conferenceRoom?.name ?? '???'}
                </div>
                <div>
                    <strong>Docente:</strong>
                    ${phdCourse.lecturer?.firstName ?? '???'} ${phdCourse.lecturer?.lastName ?? '???'}
                </div>
            `
        },
    })
})
