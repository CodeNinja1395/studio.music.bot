const TelegramBot = require('node-telegram-bot-api')

const { startOptions } = require('./lib/keyboardOptions')
const { startMessage, dateRegexp, durationRegexp, token } = require('./config')
const {
  chooseTime,
  onSelectTime,
  onNewEvent,
  addBooking,
  goHome,
  myBookings,
  cancelBooking,
  deleteBooking
} = require('./src/callbackQueries')
const { ScheduleManager } = require('./lib/ScheduleManager')

const manager = new ScheduleManager()

const bot = new TelegramBot(token, {
  polling: true
})

bot.on('message', async (msg) => {
  console.log(msg);
  if (msg.text === '/start') {
    bot.sendMessage(msg.from.id, startMessage, {
      reply_markup: startOptions()
    })
  }
})

bot.on('callback_query', async (msg) => {
  if (msg.data === 'new event') {
    onNewEvent(bot, msg.message.chat.id, msg.message.message_id)
  }

  if (dateRegexp.test(msg.data)) {
    onSelectTime(bot, msg.message.chat.id, msg.message.message_id, msg.data)
  }

  if (durationRegexp.test(msg.data)) {
    const freeTime = await manager.showFreeTime(msg.data)
    chooseTime(bot, msg.message.chat.id, msg.message.message_id, freeTime)
  }

  if (msg.data === 'home') {
    goHome(bot, msg.message.chat.id, msg.message.message_id)
  }

  if (msg.data.startsWith('add')) {
    await addBooking(
      bot,
      msg.message.chat.id,
      msg.message.message_id,
      msg.from.id,
      msg.from.first_name,
      msg.data,
      manager
    )
  }

  if (msg.data === 'my_bookings') {
    await myBookings(
      bot,
      msg.message.chat.id,
      msg.message.message_id,
      msg.from.id,
      manager
    )
  }

  if (msg.data === 'cancel_booking') {
    await cancelBooking(
      bot,
      msg.message.chat.id,
      msg.message.message_id,
      msg.from.id,
      manager
    )
  }

  if (msg.data.startsWith('delete')) {
    await deleteBooking(
      bot,
      msg.message.chat.id,
      msg.message.message_id,
      msg.from.id,
      msg.data,
      msg.from.first_name,
      manager
    )
  }

  if (msg.data === "referal") {
    // create referal link
  }
})