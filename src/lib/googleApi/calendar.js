const { google } = require('googleapis')

const calendar = google.calendar({ version:'v3' })

const { client_secret, client_id, redirect_uris, token, calendarId } = require('../../lib/config').googleCredentials

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

oAuth2Client.setCredentials(token)

class GoogleCalendar {
    constructor() {
        this.auth = oAuth2Client
        this.calendarId = calendarId
    }

    insertEvent(name, start, end) { 
        return new Promise((resolve, reject) => {
            calendar.events.insert({
                auth: this.auth,
                calendarId: this.calendarId,
                resource: {
                    summary: name,
                    start: {
                        dateTime: start,
                        timeZone: 'Europe/Kiev'
                    },
                    end: {
                        dateTime: end,
                        timeZone: 'Europe/Kiev'
                    },
                }
            }, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })     
    }
    deleteEvent(eventId) {
        return new Promise((resolve, reject) => {
            calendar.events.delete({
                auth: this.auth,
                calendarId: this.calendarId,
                eventId: eventId
            }, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
}

module.exports = GoogleCalendar
