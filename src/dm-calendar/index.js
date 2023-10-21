import './dm-calendar.css'

import { Calendar } from '@fullcalendar/core'

import itLocale from '@fullcalendar/core/locales/it'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

/**
 * @param {Element} $el Elemento su cui montare il calendario
 * @param {*} options
 */
export function createCalendar($el, { queryEvents }) {
    const calendar = new Calendar($el, {
        events: info => queryEvents({ from: info.start, to: info.end }),
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: window.matchMedia('(max-width: 512px)').matches ? 'listWeek' : 'dayGridMonth',
        allDaySlot: false,
        headerToolbar: {
            left: 'title',
            right: window.matchMedia('(max-width: 512px)').matches ? 'prev,next' : 'dayGridMonth,timeGridWeek prev,next',
        },
        titleFormat: {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
        },
        height: window.matchMedia('(max-width: 512px)').matches ? 'auto' : '100%',
        locale: itLocale,
    })

    calendar.render()

    return calendar
}
