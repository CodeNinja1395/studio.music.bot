const MySQL = require('../lib/mysql')
const GoogleCalendar = require('../lib/googleApi/calendar')

export default class ScheduleManager {
    constructor() {
        this.calendar = new GoogleCalendar()
        this.mysql = new MySQL()
        this.moment = require('../lib/moment')
    }

    async getFreeTime(date) {
        const queryDate = this.moment(date[0], 'DD.MM').format('YYYY-MM-DD')
        const bookings = await this.mysql.listBookings(queryDate)
        const freeRanges = []

        bookings.sort((a, b) => this.moment(a.start) > this.moment(b.start) ? 1 : -1)

        let start = this.moment(`${queryDate} 08:00`, 'YYYY-MM-DD hh:mm')
        let end = this.moment(`${queryDate} 22:00`, 'YYYY-MM-DD hh:mm')

        for (let i = 0; i <= bookings.length; i++) {
            if (i === bookings.length) {
                freeRanges.push(this.moment.range(start, end))
            } else {
                freeRanges.push(this.moment.range(start, this.moment(bookings[i].start)))
                start = this.moment(bookings[i].end)
            }
        }

        return freeRanges ? freeRanges : this.moment.range(start, end)
    }

    async showFreeTime(date) {
        const duration = parseInt(date[1])
        const ranges = await this.getFreeTime(date[0])
        const freeTime = []

        ranges.forEach(el => {
            const hours = Array.from(el.by('hour'))

            hours.forEach(time => {
                const timeValue = parseInt(time.format('HH'))
                let lastHour = parseInt(hours[hours.length - 1].format('HH'))
                lastHour === 21 ? lastHour = 22 : lastHour

                if (timeValue + duration <= lastHour) {
                    freeTime.push(this.moment.range(time, this.moment(time).add(duration, 'hours')))
                }
            })
        })

        return freeTime.filter(({ start }) => start > this.moment())
    }

    async isFree(dateRange) {
        dateRange = this.moment.range(this.moment(dateRange.start), this.moment(dateRange.end))

        try {
            const dayRepetitions = await this.mysql.listBookings(
                dateRange.start.format('YYYY-MM-DD')
            )

            for (const { start, end } of dayRepetitions) {
                if (dateRange.overlaps(this.moment.range(start, end))) {
                    return false
                }
            }

            return true
        } catch (err) {
            console.log(err)
        }
    }
    async newBooking(id, name, range) {
        range = {
            start: this.moment(range.start).format(),
            end: this.moment(range.end).format()
        }

        try {
            const { data: { id: eventId } } = await this.calendar.insertEvent(
                name,
                range.start,
                range.end
            )
            await this.mysql.putBooking(id, name, range, eventId)
        } catch (err) {
            console.log(err)
        }
    }
    async myBookings(id) {
        try {
            return await this.mysql.listBookingsForUser(id)
        } catch (err) {
            console.log(err)
        }
    }
    async cancelBooking(id, startDate) {
        try {
            this.calendar.deleteEvent((await this.mysql.getBooking(id, startDate)).event_id)

            return await this.mysql.deleteBooking(id, startDate)
        } catch (err) {
            console.log(err)
        }
    }
    async allBookings() {
        try {
            return await this.mysql.listAllBookings()
        } catch (err) {
            console.log(err)
            return false
        }
    }
}