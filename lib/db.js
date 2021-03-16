

module.exports = {
    putBooking: (connection, id, name, { start, end }, event_id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO rehersal (id, name, start, end, event_id) VALUES(?, ?, ?, ?, ?)',
                [id, name, start, end, event_id],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    },
    /*
    date to list rehersal need to be passed without time
    */
    listBookings: (connection, date) => {
        const from = `${date} 00:00:00`
        const until = `${date} 23:59:59`

        return new Promise((resolve, reject) => {
            connection.query(
                'select start, end, name, id, event_id from rehersal WHERE (start BETWEEN ? AND ?)',
                [from, until],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    },
    listAllBookings: (connection) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM rehersal',
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    },
    listBookingsForUser: (connection, id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'select start, end, name, id, event_id from rehersal WHERE (id = ? AND start > NOW())',
                [id],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    },
    getBooking: (connection, id, date) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM rehersal WHERE (id = ? AND start = ?)',
                [id, date],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res[0])
                }
            )
        })
    },
    deleteBooking: (connection, id, date) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM rehersal WHERE (id = ? AND start = ?)',
                [id, date],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    },
    deleteOldBookings: (connection) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM rehersal WHERE (start <= NOW())',
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            )
        })
    }
}