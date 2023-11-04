import { render } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import { Calendar as FullCalendar } from '@fullcalendar/core'
// import FullCalendar from '@fullcalendar/react'

import itLocale from '@fullcalendar/core/locales/it'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import tippy, { followCursor } from 'tippy.js'

import tippyStyles from 'tippy.js/dist/tippy.css?inline'
import tippyLightThemeStyles from 'tippy.js/themes/light-border.css?inline'

export const Calendar = ({ queryEvents, Tooltip }) => {
    const mediaQueryIsSmallScreen = window.matchMedia('(max-width: 512px)').matches
    const mediaQueryIsPointerFine = window.matchMedia('(pointer: fine)').matches

    const calendarRef = useRef()

    useEffect(() => {
        if (calendarRef.current) {
            const calendar = new FullCalendar(calendarRef.current, {
                events: info => queryEvents({ from: info.start, to: info.end }),
                plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
                initialView: mediaQueryIsSmallScreen ? 'listWeek' : 'dayGridMonth',
                headerToolbar: {
                    left: 'title',
                    right: mediaQueryIsSmallScreen ? 'prev,next' : 'dayGridMonth,timeGridWeek prev,next',
                },
                titleFormat: {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                },
                slotMinTime: '08:00:00',
                slotMaxTime: '20:00:00',
                height: 'auto',
                locale: itLocale,
                eventDidMount: Tooltip && mediaQueryIsPointerFine ? info => attachTooltip({ ...info, Tooltip }) : undefined,
            })
            calendar.render()
        }
    }, [calendarRef.current])

    return (
        <>
            <style>
                {tippyStyles}
                {tippyLightThemeStyles}
            </style>
            <div class="calendar" ref={calendarRef} />
        </>
    )
}

function attachTooltip({ el, event, Tooltip }) {
    const $root = el.getRootNode()

    const $frag = document.createDocumentFragment()
    render(<Tooltip event={event} />, $frag)

    tippy(el, {
        appendTo: $root === document ? document.body : $root,
        content: $frag,
        theme: 'light-border',
        // trigger: 'click', // useful for debugging the tooltip html
        followCursor: 'horizontal',
        maxWidth: '25rem',
        plugins: [followCursor],
        duration: 50,
    })
}
