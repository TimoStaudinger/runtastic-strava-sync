'use strict'

const readRuntasticActivities = require('./runtastic').readActivities
const readStravaActivities = require('./strava').readActivities
const writeStravaActivities = require('./strava').writeActivities
const addActivities = require('./meta').addActivities

const config = require('./config.json')

config.accounts
  .map((account) => {
    const id = new Buffer(account.user).toString('base64')
    return {
      user: account.user,
      password: account.password,
      stravaAccessToken: account.stravaAccessToken,
      id: id,
    }
  })
  .map((account) => {
    console.log(`For user ${account.user}, id ${account.id}`)
    readStravaActivities(account)
      .then(readRuntasticActivities)
      .then(writeStravaActivities)
    })
