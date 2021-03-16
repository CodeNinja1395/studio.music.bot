const mysql = require ('mysql')
const { sql } = require ('./config')

class MySQL {
    constructor() {
        this.pool = mysql.createPool({
            host: sql.host,
            user: sql.user,
            password: sql.password,
            database: sql.database
        })
    }
    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                }
                resolve(connection)
            })
        })
    }
    static query(query, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    putBooking(id, name, { start, end }, event_id) {
        return new Promise((resolve, reject) => {
            query(
                'INSERT INTO bookings (id, name, start, end, event_id) VALUES(?, ?, ?, ?, ?)',
                [id, name, start, end, event_id],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            ) 
        })
    }
    /*
    date to list bookings need to be passed without time
    */
    listBookings( date) {
        const from = `${date} 00:00:00`
        const until = `${date} 23:59:59`

        return new Promise((resolve, reject) => {
            query(
                'select start, end, name, id, event_id from bookings WHERE (start BETWEEN ? AND ?)',
                [from, until],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            ) 
        })
    }
    listAllBookings() {
        return new Promise((resolve, reject) => {
            query(
                'SELECT * FROM bookings',
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            ) 
        })
    }
    listBookingsForUser(id) {
        return new Promise((resolve, reject) => {
            query(
                'select start, end, name, id, event_id from bookings WHERE (id = ? AND start > NOW())',
                [id],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            ) 
        })
    }
    getBooking(id, date) {
        return new Promise((resolve, reject) => {
            query(
                'SELECT * FROM bookings WHERE (id = ? AND start = ?)',
                [id, date],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res[0])
                }
            ) 
        })
    }
    deleteBooking(id, date) {
        return new Promise((resolve, reject) => {
            query(
                'DELETE FROM bookings WHERE (id = ? AND start = ?)',
                [id, date],
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res)
                }
            ) 
        })
    }
    deleteOldBookings() {
        return new Promise((resolve, reject) => {
            query(
                'DELETE FROM bookings WHERE (start <= NOW())',
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

module.exports = MySQL