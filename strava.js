const strava = require('strava-v3')

exports.writeActivities = function(account) {

}

exports.readActivities = function(account) {
  console.log('Looking up existing Strava activities...')
  return new Promise((resolve, reject) => {
    strava.athlete.listActivities({
      'access_token': account.stravaAccessToken
    }, (err, payload) => {
      if(!err) {
        account.stravaActivities = payload
          .map((activity) => {
            return activity.external_id
          })
          .filter((id) => id)
        console.log(`Done. ${account.stravaActivities.length} activities found.`)
        resolve(account)
      } else reject()
    })
  })
}
