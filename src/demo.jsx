import { render } from 'preact'
import { DMCalendar } from './element.jsx'

// import rawSeminarCategories from './samples/seminar-categories.json'
// import rawConferenceRooms from './samples/conference-rooms.json'

import rawLessonsEvents from './samples/lessons.json'
import rawSeminarEvents from './samples/seminars.json'

import _ from 'lodash'

const eventLessons = rawLessonsEvents.map(lesson => {
    return {
        title: lesson.course.title,
        start: lesson.date,
        end: new Date(new Date(lesson.date).getTime() + lesson.duration * 1000 * 60),
        color: 'royalblue',
        extendedProps: {
            type: 'phdcourse-lesson',
            ...lesson,
        },
    }
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

// const eventConferences = rawConferencesEvents.data.map(conference => {
//     return {
//         title: conference.title,
//         start: conference.startDate,
//         end: conference.endDate,
//         color: 'purple',
//         allDay: true,
//         extendedProps: {
//             type: 'conference',
//             ...conference,
//         },
//     }
// })

render(
    <DMCalendar
        endpoint="https://manage.dm.unipi.it/"
        includes="phd-courses"
        queryEvents={async ({}) => {
            return [
                ...eventLessons,
                ...eventSeminars,
                // ...eventConferences
            ]
        }}
    />,
    document.querySelector('.dm-calendar')
)
