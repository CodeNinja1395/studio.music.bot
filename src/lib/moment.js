const Moment = require('moment-timezone')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)

moment.tz.setDefault('Europe/Kiev')

module.exports = moment