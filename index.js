'use strict'

const runtasticStravaSync = require('./runtastic-strava-sync')
const config = require('./config.json')

const accounts = config.accounts
  .map((account) => {
    const id = new Buffer(account.user).toString('base64')
    return {
      user: account.user,
      password: account.password,
      stravaAccessToken: account.stravaAccessToken,
      id: id,
    }
  })

setInterval(() => {
  accounts.map((account) => {
    runtasticStravaSync(account)
  })
}, 10 * 60 * 1000)
