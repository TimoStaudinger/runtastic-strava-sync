'use strict'

const strava = require('strava-v3')

const mapRuntasticActivityToStrava = require('./Activities').mapRuntasticToStrava

exports.readActivities = function(account) {
  console.log('Looking up existing Strava activities...')
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({
      'access_token': account.stravaAccessToken,
      'per_page': 99
    }, (err, payload) => {
      if(!err && Array.isArray(payload)) {
        account.stravaActivities = payload
          .map((activity) => {
            return +activity.external_id.split('.')[0]
          })
          .filter((id) => id)
        console.log(`Done. ${account.stravaActivities.length} activities found.`)
        resolve(account)
      } else {
        console.log(payload)
        reject()
      }
    })
  })
}

exports.writeActivities = function(account) {
  console.log('Uploading Strava activities...')

  let uploadPromises = []

  account.loadedActivities.map((activity) => {
    uploadPromises.push(new Promise((resolve, reject) => {
      try {
        strava.uploads.post({
          'access_token': account.stravaAccessToken,
          'data_type': 'gpx',
          'file': `gpx/${activity.id}.gpx`,
          'activity_type': mapRuntasticActivityToStrava(activity.type),
          'external_id': activity.id,
          'statusCallback': (err, payload) => {
            if(payload.error) {
              console.log(payload.error)
              reject()
            }
            if(payload.activity_id) resolve()
          }
        }, () => {})
      } catch(e) {
        console.log(e)
      }
    }))
  })

  Promise.all(uploadPromises).then(() => {
    console.log(`Done. ${uploadPromises.length} activities uploaded.`)
  })

}
