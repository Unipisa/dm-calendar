import rawSeminarCategories from './samples/seminar-categories.json'
import rawConferenceRooms from './samples/conference-rooms.json'

import rawPhdCourseEvents from './samples/phd-courses.json'
import rawSeminarEvents from './samples/seminars-dedup.json'
import rawConferencesEvents from './samples/conferences-dedup.json'

import _ from 'lodash'

import { createCalendar } from './dm-calendar'

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

const conferenceRooms = _.keyBy(rawConferenceRooms.data, '_id')
const seminarCategories = _.keyBy(rawSeminarCategories.data, '_id')

const eventPhdCourses = rawPhdCourseEvents.data.flatMap(phdCourse => {
    return phdCourse.lessons.map(lesson => ({
        title: phdCourse.title,
        start: lesson.date,
        end: new Date(new Date(lesson.date).getTime() + lesson.duration * 1000 * 60),
        color: 'royalblue',
        extendedProps: {
            type: 'phdcourse-lesson',
            ...phdCourse,
            lesson: {
                ...lesson,
                conferenceRoom: conferenceRooms[lesson.conferenceRoom],
            },
        },
    }))
})

const eventSeminars = rawSeminarEvents.data.map(seminar => {
    return {
        title: seminar.title,
        start: seminar.startDatetime,
        end: new Date(new Date(seminar.date).getTime() + seminar.duration * 1000 * 60),
        color: 'green',
        extendedProps: {
            type: 'seminar',
            ...seminar,
        },
    }
})

const eventConferences = rawConferencesEvents.data.map(conference => {
    console.log(conference)

    return {
        title: conference.title,
        start: conference.startDate,
        end: conference.endDate,
        color: 'purple',
        allDay: true,
        extendedProps: {
            type: 'conference',
            ...conference,
        },
    }
})

document.addEventListener('DOMContentLoaded', () => {
    createCalendar(document.querySelector('.dm-calendar'), {
        async queryEvents({ from, to }) {
            from ??= MIN_DATE
            to ??= MAX_DATE

            return [...eventPhdCourses, ...eventSeminars, ...eventConferences]
        },
        customTooltip({ extendedProps: { type, ...props } }) {
            if (type === 'phdcourse-lesson')
                return `
                    <div class="tooltip-header">
                        ${props.title}
                    </div>
                    <div class="tooltip-content phdcourse-lesson">
                        <div>
                            <strong>Aula:</strong>
                            ${props.lesson.conferenceRoom?.name ?? '???'}
                        </div>
                        <div>
                            <strong>Docente:</strong>
                            ${props.lecturer?.firstName ?? '???'} ${props.lecturer?.lastName ?? '???'}
                        </div>
                    </div>
                `
            if (type === 'seminar')
                return `
                    <div class="tooltip-header">
                        ${props.title}
                    </div>
                    <div class="tooltip-content seminar">
                        <div class="tooltip-abstract">
                            ${props.abstract}
                        </div>
                        ${
                            props.category
                                ? `
                                <div>
                                    <strong>Ciclo di Seminari:</strong>
                                    ${props.category?.name ?? '???'}
                                </div>
                                `
                                : ''
                        }
                        <div>
                            <strong>Aula:</strong>
                            ${props.conferenceRoom?.name ?? '???'}
                        </div>
                        <div>
                            <strong>Speaker:</strong>
                            ${props.speaker?.firstName ?? '???'} ${props.speaker?.lastName ?? '???'}
                        </div>
                    </div>
                `
            if (type === 'conference')
                return `
                    <div class="tooltip-header">
                        ${props.title}
                    </div>
                    <div class="tooltip-content conference">
                        ${
                            props.notes.length > 0
                                ? `
                                    <div class="tooltip-abstract">
                                        ${props.notes}
                                    </div>
                                `
                                : ''
                        }
                        <div>
                            <strong>Aula:</strong>
                            ${props.conferenceRoom?.name ?? '???'}
                        </div>
                    </div>
                `
        },
    })
})
