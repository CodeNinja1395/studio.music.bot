const { moment } = require('./ScheduleManager')

const day = (count) => moment().add(count, 'days').format('DD.MM')
const weekDay = (count) => moment().add(count, 'days').weekday()

const weekdays = {
    1: 'пн',
    2: 'вт',
    3: 'ср',
    4: 'чт',
    5: 'пт',
    6: 'сб',
    0: 'вс',
}

module.exports = {
    startOptions: () => JSON.stringify({
        inline_keyboard: [
            [{ text: '📝 Забить репу', callback_data: 'new event'}],
            [{ text: '🎸 Мои репетиции', callback_data: 'my_bookings'}],
            [{ text: '❌ Отменить репу', callback_data: 'cancel_booking'}]
        ]
    }),

    homeOptions: () => JSON.stringify({
        inline_keyboard: [
            [{ text: 'Меню 🏘', callback_data: 'home'}]
        ]
    }),

    successOptions: () =>  JSON.stringify({
        inline_keyboard: [
            [{ text: 'Отменить репу', callback_data: 'cancel_event'}],
            [{ text: 'Свободное время', callback_data: 'free_time'}],
            [{ text: 'Мои репетиции', callback_data: 'my_bookings'}]
        ]
    }),

    chooseDayOptions: () => JSON.stringify({
        inline_keyboard: [
            [
                { text: 'сегодня', callback_data: day(0)},
                { text: 'завтра', callback_data: day(1)}
            ],
            [
                { text: `${weekdays[weekDay(2)]}, ${day(2)}`, callback_data: day(2)}, 
                { text: `${weekdays[weekDay(3)]}, ${day(3)}`, callback_data: day(3)},
                { text: `${weekdays[weekDay(4)]}, ${day(4)}`, callback_data: day(4)},
                { text: `${weekdays[weekDay(5)]}, ${day(5)}`, callback_data: day(5)}
            ],
            [
                { text: `${weekdays[weekDay(6)]}, ${day(6)}`, callback_data: day(6)}, 
                { text: `${weekdays[weekDay(7)]}, ${day(7)}`, callback_data: day(7)},
                { text: `${weekdays[weekDay(8)]}, ${day(8)}`, callback_data: day(8)},
                { text: `${weekdays[weekDay(9)]}, ${day(9)}`, callback_data: day(9)}
            ],
            [
                { text: `${weekdays[weekDay(10)]}, ${day(10)}`, callback_data: day(10)}, 
                { text: `${weekdays[weekDay(11)]}, ${day(11)}`, callback_data: day(11)},
                { text: `${weekdays[weekDay(12)]}, ${day(12)}`, callback_data: day(12)},
                { text: `${weekdays[weekDay(13)]}, ${day(13)}`, callback_data: day(13)}
            ],
            [{ text: 'Меню 🏘', callback_data: 'home'}]
        ]
    }),
    
    durationOptions: (date) => JSON.stringify({
        inline_keyboard: [
            [{ text: '2 часа', callback_data: `${date} 2`}],
            [{ text: '3 часа', callback_data: `${date} 3`}],
            [{ text: '4 часа', callback_data: `${date} 4`}],
            [{ text: 'Меню 🏘', callback_data: 'home'}],              
        ]
    })     
}