import { createCalendar } from './dm-calendar'

document.addEventListener('DOMContentLoaded', () => {
    const $container = document.querySelector('.dm-calendar')
    const $root = $container.attachShadow({ mode: 'open' })
    $root.innerHTML = `
        <link rel="stylesheet" href="https://unipisa.github.io/dm-calendar/lib/dm-calendar.css">
        <div class="calendar"></div>
    `

    createCalendar($root.querySelector('.calendar'), {
        async queryEvents({ from, to }) {
            const req = await fetch('https://manage.develop.lb.cs.dm.unipi.it/api/v0/public/courses', {
                mode: 'cors',
            })

            const events = await req.json()
            return events.flatMap(phdCourse => {
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
                            conferenceRoom: {
                                name: 'Aula Seminari (DM)',
                            },
                        },
                    },
                }))
            })
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
        },
    })
})
