'use strict'

const readRuntasticActivities = require('./runtastic').readActivities
const readStravaActivities = require('./strava').readActivities
const writeStravaActivities = require('./strava').writeActivities

module.exports = function(account) {
  console.log(`For user ${account.user}, id ${account.id}`)
  readStravaActivities(account)
    .then(readRuntasticActivities)
    .then(writeStravaActivities)
}
