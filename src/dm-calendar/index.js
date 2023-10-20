import './dm-calendar.css'

import { Calendar } from '@fullcalendar/core'

import itLocale from '@fullcalendar/core/locales/it'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

/**
 * @param {Element} $el Elemento dentro cui montare il calendario
 * @param {*} options
 */
export function createCalendar($el, { queryEvents }) {
    const calendar = new Calendar($el, {
        events: info => queryEvents({ from: info.start, to: info.end }),
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        allDaySlot: false,
        headerToolbar: {
            left: 'title',
            right: 'dayGridMonth,timeGridWeek prev,next',
        },
        titleFormat: {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
        },
        height: '100%',
        locale: itLocale,
    })

    calendar.render()

    return calendar
}
