var Moment = require('moment-timezone')
const MomentRange = require('moment-range')
const cron = require('node-cron')

const {
  listBookings, listAllBookings, putBooking,
  listBookingsForUser, deleteBooking, deleteOldBookings
} = require('./db')

const MySqlConnection = require('./MySqlConnection')

const GoogleCalendar = require('./googleApi/calendar')

const moment = MomentRange.extendMoment(Moment)

moment.tz.setDefault('Europe/Kiev')

class ScheduleManager {
  constructor() { }

  async getFreeTime(date) {
    date = date.split(' ')
    const conn = await new MySqlConnection().getConnection()
    const queryDate = moment(date[0], 'DD.MM').format('YYYY-MM-DD')

    const bookings = await listBookings(conn, queryDate)

    const freeRanges = []

    bookings.sort((a, b) => moment(a.start) > moment(b.start) ? 1 : -1)

    let start = moment(`${queryDate} 08:00`, 'YYYY-MM-DD hh:mm')
    let end = moment(`${queryDate} 22:00`, 'YYYY-MM-DD hh:mm')

    for (let i = 0; i <= bookings.length; i++) {
      if (i === bookings.length) {
        freeRanges.push(moment.range(start, end))
      } else {
        freeRanges.push(moment.range(start, moment(bookings[i].start)))
        start = moment(bookings[i].end)
      }
    }

    return freeRanges ? freeRanges : moment.range(start, end)
  }

  async showFreeTime(date) {
    date = date.split(' ')

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
          freeTime.push(moment.range(time, moment(time).add(duration, 'hours')))
        }
      })
    })

    return freeTime.filter(({ start }) => start > moment())
  }
  async cronCleaner() {
    cron.schedule('1 8-20 * * *', async () => {
      const conn = await new MySqlConnection().getConnection()
      await deleteOldBookings(conn)

      conn.release()
    })
    //remove all past bookings every hour between 8 - 20 
  }
  async isFree(dateRange, conn) {
    dateRange = moment.range(moment(dateRange.start), moment(dateRange.end))

    try {
      const dayRepetitions = await listBookings(
        conn || new MySqlConnection().pool,
        dateRange.start.format('YYYY-MM-DD')
      )

      for (const { start, end } of dayRepetitions) {
        if (dateRange.overlaps(moment.range(start, end))) {
          return false
        }
      }

      return true
    } catch (err) {
      console.log(err)
    }
  }
  async newBooking(id, name, range) {
    const conn = await new MySqlConnection().getConnection()
    range = {
      start: moment(range.start).format(),
      end: moment(range.end).format()
    }
    try {
      // const { data: { id: eventId } } = await new GoogleCalendar().insertEvent(
      //   name,
      //   range.start,
      //   range.end
      // )
      await putBooking(new MySqlConnection().pool, id, name, range, eventId)
    } catch (err) {
      console.log(err)
      return false
    } finally {
      conn.release()
    }
  }
  async myBookings(id) {
    const conn = await new MySqlConnection().getConnection()
    try {
      return await listBookingsForUser(conn, id)
    } catch (err) {
      console.log(err)
      return false
    } finally {
      conn.release()
    }
  }
  async cancelBooking(id, startDate) {
    const conn = await new MySqlConnection().getConnection()

    try {
      // new GoogleCalendar().deleteEvent(
      //   (await getBooking(conn, id, startDate)).event_id
      // )
      return await deleteBooking(conn, id, startDate)
    } catch (err) {
      console.log(err)
      return false
    } finally {
      conn.release()
    }
  }
  async allBookings() {
    const conn = await new MySqlConnection().getConnection()

    try {
      return await listAllBookings(conn)
    } catch (err) {
      console.log(err)
      return false
    } finally {
      conn.release()
    }
  }
}

module.exports = { ScheduleManager, moment }