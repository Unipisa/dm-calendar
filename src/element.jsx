import register from 'preact-custom-element'
import { Calendar } from './tooltip-calendar'

import styles from './tooltip-calendar/dm-calendar.css?inline'

const tooltipVariants = {
    'phdcourse-lesson': ({ course, conferenceRoom }) => {
        return (
            <>
                <div class="tooltip-header">{course.title}</div>
                <div class="tooltip-content phdcourse-lesson">
                    <div class="tooltip-abstract">{course.description}</div>
                    <div>
                        <strong>Aula:</strong> {conferenceRoom?.name ?? '???'}
                    </div>
                    {course.lecturers && (
                        <div>
                            {course.lecturers.length === 1 ? (
                                <>
                                    <strong>Docente:</strong> {course.lecturers[0].firstName ?? '???'} {course.lecturers[0].lastName ?? '???'}
                                </>
                            ) : (
                                <>
                                    <strong>Docenti:</strong> {course.lecturers.map(l => `${l.firstName} ${l.lastName}`).join(', ')}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </>
        )
    },
    'seminar': ({ ...props }) => (
        <>
            <div class="tooltip-header">{props.title}</div>
            <div class="tooltip-content seminar">
                <div class="tooltip-abstract">{props.abstract}</div>
                {props.category && (
                    <div>
                        <strong>Ciclo di Seminari:</strong> {props.category?.name ?? '???'}
                    </div>
                )}
                <div>
                    <strong>Aula:</strong> {props.conferenceRoom?.name ?? '???'}
                </div>
                <div>
                    <strong>Speaker:</strong> {props.speaker?.firstName ?? '???'} {props.speaker?.lastName ?? '???'}
                </div>
            </div>
        </>
    ),
    // TODO: Convert to JSX
    // if (type === 'conference')
    //     return `
    //         <div class="tooltip-header">
    //             ${props.title}
    //         </div>
    //         <div class="tooltip-content conference">
    //             ${
    //                 props.notes.length > 0
    //                     ? `
    //                         <div class="tooltip-abstract">
    //                             ${props.notes}
    //                         </div>
    //                     `
    //                     : ''
    //             }
    //             <div>
    //                 <strong>Aula:</strong>
    //                 ${props.conferenceRoom?.name ?? '???'}
    //             </div>
    //         </div>
    //     `
}

const CalendarEventTooltip = ({ event }) => {
    const { type, ...props } = event.extendedProps
    const EventTooltip = tooltipVariants[type]
    if (!EventTooltip) {
        return (
            <>
                <div class="tooltip-header">Error</div>
                <div class="tooltip-content">Unknown event type "{type}"</div>
            </>
        )
    }

    return <EventTooltip {...props} />
}

const cachedLessons = {}

const getLessons = async ({ endpoint, from, to, phd }) => {
    const cacheKey = `${from.toISOString()} - ${to.toISOString()} - ${phd || 'all'}`
    
    let lessonsInRange = cachedLessons[cacheKey]
    if (!lessonsInRange) {
        let url = `${endpoint}/api/v0/public/lessons?from=${from.toISOString()}&to=${to.toISOString()}`
        if (phd) {
            url += `&phd=${phd}`
        }
        
        const req = await fetch(url, { mode: 'cors' })
        const events = (await req.json()).data

        const basePath = window.location.pathname.replace(/\/calendar.*$/, '')
        
        lessonsInRange = events.map(lesson => ({
            title: lesson.course.title,
            start: lesson.date,
            end: new Date(new Date(lesson.date).getTime() + lesson.duration * 1000 * 60),
            url: `${window.location.origin}${basePath}/phd-course-details/?phd_course_id=${lesson.course._id}`,
            color: 'royalblue',
            extendedProps: {
                type: 'phdcourse-lesson',
                ...lesson,
            },
        }))
        
        cachedLessons[cacheKey] = lessonsInRange
    }
    
    return lessonsInRange
}

const cachedSeminars = {}

/**
 * @param {string} category label della categoria
 * @returns {string} colore personalizzato associato alla categoria
 */
const getSeminarCategoryColor = category =>
    ({
        ['colloquium']: 'orange',
    }[category] ?? 'green')

// FIX: Per ora scarichiamo tutti i seminari con l'endpoint "/public/seminars" e li filtriamo lato client per categoria
const getSeminarCategory = async ({ endpoint, category, from, to }) => {
    const cacheKey = `${from.toISOString()} - ${to.toISOString()}`

    let seminarsInRange = cachedSeminars[cacheKey]
    if (!seminarsInRange) {
        const req = await fetch(endpoint + `/api/v0/public/seminars?_limit=500&_sort=startDateTime&from=${from.toISOString()}&to=${to.toISOString()}`, {
            mode: 'cors',
        })
        seminarsInRange = (await req.json()).data
        cachedSeminars[cacheKey] = seminarsInRange
    }

    return seminarsInRange
        .filter(seminar => seminar?.category?.label === category)
        .map(seminar => ({
            title: seminar.title,
            start: seminar.startDatetime,
            end: new Date(new Date(seminar.startDatetime).getTime() + seminar.duration * 1000 * 60),
            // url: `https://www.dm.unipi.it/seminario/?id=${seminar._id}`,
            url: `https://www.dm.unipi.it/en/seminar/?id=${seminar._id}`,
            color: getSeminarCategoryColor(seminar.category.label),
            extendedProps: {
                type: 'seminar',
                ...seminar,
            },
        }))
}

export const DMCalendar = ({ endpoint, includes, queryEvents }) => {
    const includeParts = includes.split(/\s+/)

    return (
        <>
            {/* <link rel="stylesheet" href="https://unipisa.github.io/dm-calendar/lib/dm-calendar.css" /> */}
            <style>{styles}</style>
            <Calendar
                Tooltip={CalendarEventTooltip}
                queryEvents={
                    queryEvents ??
                    (async ({ from, to }) => {
                        const events = []

                        for (const part of includeParts) {
                            let m
                            if ((m = part.match(/phd-courses(?:=(?<phd>\S+))?/))) {
                                events.push(...(await getLessons({ endpoint, from, to, phd: m.groups?.phd })))
                                continue
                            }
                            if ((m = part.match(/seminars/))) {
                                events.push(...(await getSeminars({ endpoint, from, to })))
                                continue
                            }
                            if ((m = part.match(/seminar-category=(?<category>\S+)/))) {
                                events.push(...(await getSeminarCategory({ endpoint, category: m.groups.category, from, to })))
                                continue
                            }

                            throw new Error(`invalid include syntax "${part}"`)
                        }

                        return events
                    })
                }
            />
        </>
    )
}

register(DMCalendar, 'dm-calendar', ['endpoint', 'includes'], { shadow: true })
