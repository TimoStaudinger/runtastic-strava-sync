'use strict'

const request = require('request').defaults({jar: true})
const cheerio = require('cheerio')
const fs = require('fs')

const Activities = require('./Activities').RuntasticActivities

const OVERVIEW_URL = 'https://www.runtastic.com/en/users/Timo-Staudinger/sport-sessions#single_year_2016'
const SIGN_IN_URL = 'https://www.runtastic.com/en/d/users/sign_in'
const FILE_URL_PREFIX = 'https://www.runtastic.com/en/users/Timo-Staudinger/sport-sessions/'
const GPX_EXTENSION = '.gpx'


exports.readActivities = function(account) {
  return new Promise((resolveAll, rejectAll) => {
    console.log('Looking up Runtastic activities...')
    new Promise((resolve, reject) => {
      request(OVERVIEW_URL, (error, response, data) => {
        let $ = cheerio.load(data)
        resolve($('meta[name="csrf-token"]').attr('content'))
      })
    }).then((csrfToken) => {
      return new Promise((resolve, reject) => {
        const LOGON_HEADERS = {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Encoding': 'gzip, deflate',
          'Authorization': 'com.runtastic.ember',
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'X-App-Version': '1.0'
        }
        const LOGON_FORM = {
          'user[email]': account.user,
          'user[password]': account.password,
          'authenticity_token': csrfToken,
          'grant_type': 'password'
        }
        request.post({
          url: SIGN_IN_URL,
          headers: LOGON_HEADERS,
          form: LOGON_FORM,
          jar: true
        }, (error, response, data) => {
          if(response.statusCode === 200) {
            resolve()
          }
          else {
            console.log(`Logon failed with status code ${response.statusCode}`)
            reject()
          }
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        try {
          request(OVERVIEW_URL, (error, response, data) => {
            try {
              const regex = /var index_data = (.*?\]\])/
              const activities = eval(data.match(regex)[1])
              resolve(activities)
            } catch(e) {
              console.log(e)
              reject()
            }
          })
        } catch(e) {
          console.log(e)
          reject()
        }
      })
    }).then((activities) => {
      activities = activities
        .filter((activity) => activity[2] === Activities.RUNNING || activity[2] === Activities.CYCLING )
        .filter((activity) => account.stravaActivities.indexOf(activity[0]) === -1)
      console.log(`Done. ${activities.length} new activities found.`)
      console.log('Downloading GPX files...')

      account.loadedActivities = []
      let getActivityPromises = []
      activities.forEach((activity) => {
        getActivityPromises.push(new Promise((resolve, reject) => {
          try {
            const id = activity[0]
            request(FILE_URL_PREFIX + id + GPX_EXTENSION)
              .on('error', console.log)
              .pipe(fs.createWriteStream(`gpx/${id}.gpx`))
              .on('close', () => {
                account.loadedActivities.push({
                  id: id,
                  type: activity[2]
                })
                resolve()
              })
          } catch (e) {
              console.log(e)
          }
        }))
      })
      Promise.all(getActivityPromises).then(() => {
        console.log(`Done. ${getActivityPromises.length} GPX files downloaded.`)
        resolveAll(account)
      })
    })
  })
}
