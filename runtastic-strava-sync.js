'use strict'

const readRuntasticActivities = require('./runtastic').readActivities
const readStravaActivities = require('./strava').readActivities
const writeStravaActivities = () => {}
const readMeta = require('./meta').readMeta
const writeMeta = require('./meta').writeMeta
const addActivities = require('./meta').addActivities

const config = require('./config.json')

config.accounts
  .map((account) => {
    const id = new Buffer(account.user).toString('base64')
    const meta = readMeta(id)
    return {
      user: account.user,
      password: account.password,
      stravaAccessToken: account.stravaAccessToken,
      id: id,
      meta: meta
    }
  })
  .map((account) => {
    console.log(`For user ${account.user}, id ${account.id}`)
    readStravaActivities(account)
      .then(readRuntasticActivities)
      .then(writeStravaActivities)
      .then(writeMeta)
    })
