const { formatTimeUser, formatDateUser, formatDateSql } = require('../lib/util')
const {
  startOptions,
  chooseDayOptions,
  durationOptions,
  homeOptions
} = require('../lib/keyboardOptions')

module.exports = {

  onNewEvent: async (bot, chatId, messageId) => {
    bot.editMessageText('выбери день', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: chooseDayOptions(),
    })
  },

  onSelectTime: async (bot, chatId, messageId, data) => {
    bot.editMessageText('выбери длительность репетиции', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: durationOptions(data),
    })
  },

  goHome: (bot, chatId, messageid) => {
    bot.editMessageText('Нет забронированных репетиций', {
      chat_id: chatId,
      message_id: messageid,
      reply_markup: startOptions(),
    })
  },

  chooseTime: (bot, chatId, messageId, freeTime) => {
    let replyMarkup = {
      inline_keyboard: []
    }

    if (freeTime.length > 0) {
      freeTime.forEach(({ start, end }) => {
        replyMarkup.inline_keyboard.push(
          [{ text: `${formatTimeUser(start)} - ${formatTimeUser(end)}`, callback_data: `add_${formatDateSql(start)}_${formatDateSql(end)}` }]
        )
      })

      replyMarkup.inline_keyboard.push([{ text: 'Меню 🏘', callback_data: 'home' }])

      replyMarkup = JSON.stringify(replyMarkup)

      bot.editMessageText('Выбери свободное время', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup,
      })
    } else {
      bot.editMessageText('Нет свободного времени', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
    }
  },

  addBooking: async (bot, chatId, messageId, fromId, userName, data, manager) => {
    const time = data.split('_')
    const range = {
      start: time[1],
      end: time[2]
    }

    if (await manager.isFree(range)) {
      bot.editMessageText('Бронирование успешно завершено!', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: startOptions(),
      })

      await manager.newBooking(fromId, userName, range)

      bot.sendMessage(-278460267, `${userName} \nc: ${formatDateUser(range.start)}\nпо: ${formatDateUser(range.end)}`)
      // bot.sendMessage(187189793, `${userName} \nc: ${formatDateUser(range.start)}\nпо: ${formatDateUser(range.end)}`)
    } else {
      bot.editMessageText('Данное время занято!', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
    }
  },

  myBookings: async (bot, chatId, messageId, fromId, manager) => {
    const bookings = await manager.myBookings(fromId)
    console.log(bookings)

    if (bookings.length > 0) {
      let response = 'ваши бронирования: \n\n'

      bookings.forEach(({ start, end }) => {
        response += `🔹 ${formatDateUser(start)} - ${formatDateUser(end).split(' ')[1]}\n`
      })

      bot.editMessageText(response, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
    } else {
      bot.editMessageText('Нет забронированных репетиций', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
    }
  },
  deleteBooking: async (bot, chatId, messageId, fromId, data, userName, manager) => {
    console.log("DDDDD");
    const date = data.split('_')[1]

    const res = await manager.cancelBooking(fromId, date)
    if (res.affectedRows) {
      bot.editMessageText('Репетиция отменена', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: startOptions(),
      })

      bot.sendMessage(-278460267, `ОТМЕНА: ${userName} ${formatDateUser(date)}`)
    } else {
      bot.editMessageText('Репетиция уже отменена', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
    }
  },
  cancelBooking: async (bot, chatId, messageId, fromId, manager) => {
    const bookings = await manager.myBookings(fromId)
    let replyMarkup = {
      inline_keyboard: []
    }
    if (bookings.length === 0) {
      bot.editMessageText('Нет забронированных репетиций', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: homeOptions(),
      })
      return
    }

    bookings.forEach(({ start }) => {
      replyMarkup.inline_keyboard.push(
        [{ text: formatDateUser(start), callback_data: `delete_${formatDateSql(start)}` }]
      )
    })
    replyMarkup.inline_keyboard.push([{ text: 'Меню 🏘', callback_data: 'home' }])
    replyMarkup = JSON.stringify(replyMarkup)

    bot.editMessageText('Какую репетицию ты хочешь отменить?', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: replyMarkup,
    })

  }
}