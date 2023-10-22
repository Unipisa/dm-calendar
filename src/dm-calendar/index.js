import { Calendar } from '@fullcalendar/core'

import itLocale from '@fullcalendar/core/locales/it'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'

import './dm-calendar.css'

/**
 * @param {Element} $el Elemento su cui montare il calendario
 * @param {*} options
 */
export function createCalendar($el, { queryEvents }) {
    const mediaQueryIsSmallScreen = window.matchMedia('(max-width: 512px)').matches
    const mediaQueryIsPointerFine = window.matchMedia('(pointer: fine)').matches

    const calendar = new Calendar($el, {
        events: info => queryEvents({ from: info.start, to: info.end }),
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: mediaQueryIsSmallScreen ? 'listWeek' : 'dayGridMonth',
        allDaySlot: false,
        headerToolbar: {
            left: 'title',
            right: mediaQueryIsSmallScreen ? 'prev,next' : 'dayGridMonth,timeGridWeek prev,next',
        },
        titleFormat: {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
        },
        height: mediaQueryIsSmallScreen ? 'auto' : '100%',
        locale: itLocale,
        eventDidMount: mediaQueryIsPointerFine
            ? info => {
                  const { phdCourse } = info.event.extendedProps

                  tippy(info.el, {
                      content: `
                    <div class="title">${phdCourse.title}</div>
                    <strong>Docente:</strong> ${phdCourse.lecturer.firstName} ${phdCourse.lecturer.lastName}
                `,
                      allowHTML: true,
                      theme: 'light-border',
                  })
              }
            : undefined,
    })

    calendar.render()

    return calendar
}
