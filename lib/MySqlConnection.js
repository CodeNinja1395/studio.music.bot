const mysql = require('mysql')
const { sql } = require('../config')

class MySQLConnection {
  constructor() {
    this.pool = mysql.createPool({
      host: sql.host,
      user: sql.user,
      password: sql.password,
      database: sql.database,
      port: 3304,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
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
  query(query, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, params, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }
}

module.exports = MySQLConnection