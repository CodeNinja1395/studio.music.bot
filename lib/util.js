const { weekDays } = require('../config')

const { moment } = require('./ScheduleManager')

module.exports = {
  parseWeekday: (day, time, duration) => {
    const timeStamp = time.split(':')
    const selectedDay = weekDays[day]
    const today = moment().day()
    const timeParams = {
      h: timeStamp[0],
      m: timeStamp[1]
    }
    let start = null

    if (day === 'сегодня') {
      start = moment().set(timeParams)
    } else if (day === 'завтра') {
      start = moment().add(1, 'days').set(timeParams)
    } else if (day === 'послезавтра' || day === 'после завтра') {
      start = moment().add(2, 'days').set(timeParams)
    } else if (selectedDay <= today) {
      start = moment().add(7 - (today - selectedDay), 'days').set(timeParams)
    } else {
      start = moment().add(selectedDay - today, 'days').set(timeParams)
    }

    return moment.range(start, moment(start).add(duration, 'hours'))
  },
  validateWeekdayInput: (day, time, duration) => {
    const timeStamp = time.split(':')

    if (weekDays[day] === undefined || !/(2[0-3]|[01][0-9]):[0-5][0-9]/.test(time)) {
      console.log('invalid input')
      return false
    }
    if (parseInt(timeStamp[1]) < 0 || parseInt(timeStamp[1]) >= 60) {
      console.log('wrong minutes')
      return false
    }
    if (duration > 4) {
      console.log('too long')
      return false
    }
    if ((parseInt(timeStamp[0]) < 8 && (parseInt(timeStamp[0]) > 20))) {
      console.log('closed')
      return false
    }

    return true
  },
  getDateRange: (date, time, duration) => {
    const start = moment(`${date} ${time}`, 'DD.MM.YYYY hh:mm')
    console.log('mem ', start)

    const end = moment(`${date} ${time}`, 'DD.MM.YYYY hh:mm').add(duration, 'hours')

    return moment.range(start, end)
  },
  formatDateUser: (date) => {
    return moment(date).format('DD.MM HH:mm')
  },
  formatTimeUser: (date) => {
    return moment(date).format('HH:mm')
  },
  formatDateSql: (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }
}