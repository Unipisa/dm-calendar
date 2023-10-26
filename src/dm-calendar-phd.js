import { createCalendar } from './dm-calendar'

document.addEventListener('DOMContentLoaded', () => {
    createCalendar(document.querySelector('.dm-calendar'), {
        async queryEvents({ from, to }) {
            const req = await fetch('https://manage.develop.lb.cs.dm.unipi.it/api/v0/event-phd-course?_limit=9999', {
                headers: {
                    Authorization: 'Bearer a185acfcfc3c87b2f8d62a6ba8325036',
                }
            })

            const {data} = await req.json()

            return data.flatMap(phdCourse => {
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