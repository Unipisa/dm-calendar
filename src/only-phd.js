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
            const req = await fetch('https://manage.develop.lb.cs.dm.unipi.it/api/v0/public/lessons', {
                mode: 'cors',
            })

            const events = await req.json()
            return events.map(lesson => ({
                title: lesson.course.title,
                start: lesson.date,
                end: new Date(new Date(lesson.date).getTime() + lesson.duration * 1000 * 60),
                url: `https://www.dm.unipi.it/phd/phd-course-details/?phd_course_id=${lesson.course._id}`,
                color: 'royalblue',
                extendedProps: {
                    type: 'phdcourse-lesson',
                    ...lesson,
                },
            }))
        },
        customTooltip({ extendedProps: { type, ...props } }) {
            if (type === 'phdcourse-lesson')
                return `
                    <div class="tooltip-header">
                        ${props.course.title}
                    </div>
                    <div class="tooltip-content phdcourse-lesson">
                        <div class="tooltip-abstract">
                            ${props.course.description}
                        </div>
                        <div>
                            <strong>Aula:</strong>
                            ${props.conferenceRoom?.name ?? '???'}
                        </div>
                        ${
                            props.course.lecturers
                                ? `
                                    <div>
                                        ${
                                            props.course.lecturers.length === 1
                                                ? `
                                                    <strong>Docente:</strong>
                                                    ${props.course.lecturers[0].firstName ?? '???'} ${
                                                      props.course.lecturers[0].lastName ?? '???'
                                                  }
                                                `
                                                : `
                                                    <strong>Docenti:</strong>
                                                    ${props.course.lecturers.map(l => `${l.firstName} ${l.lastName}`).join(', ')}
                                                `
                                        }
                                    </div>
                                `
                                : ''
                        }
                    </div>
                `
        },
    })
})
