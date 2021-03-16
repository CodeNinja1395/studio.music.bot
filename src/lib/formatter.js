const moment = require('./moment')

module.exports = {
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