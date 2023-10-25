import { Calendar } from '@fullcalendar/core'

import itLocale from '@fullcalendar/core/locales/it'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import tippy, { followCursor } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'

import './dm-calendar.css'

/**
 * @param {Element} $el Elemento su cui montare il calendario
 * @param {*} options
 */
export function createCalendar($el, { queryEvents, customTooltip }) {
    const mediaQueryIsSmallScreen = window.matchMedia('(max-width: 512px)').matches
    const mediaQueryIsPointerFine = window.matchMedia('(pointer: fine)').matches

    const calendar = new Calendar($el, {
        events: info => queryEvents({ from: info.start, to: info.end }),
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: mediaQueryIsSmallScreen ? 'listWeek' : 'dayGridMonth',
        // allDaySlot: false,
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
        eventDidMount: customTooltip && mediaQueryIsPointerFine ? info => attachTooltip({ ...info, customTooltip }) : undefined,
    })

    calendar.render()

    return calendar
}

function attachTooltip({ el, event, customTooltip }) {
    tippy(el, {
        content: customTooltip(event),
        allowHTML: true,
        theme: 'light-border',
        // trigger: 'click', // useful for debugging the tooltip html
        followCursor: 'horizontal',
        maxWidth: '25rem',
        plugins: [followCursor],
        duration: 50,
    })
}
