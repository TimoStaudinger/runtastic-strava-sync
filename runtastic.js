'use strict'

const request = require('request').defaults({jar: true})
const cheerio = require('cheerio')
const fs = require('fs')

const OVERVIEW_URL = 'https://www.runtastic.com/en/users/Timo-Staudinger/sport-sessions#single_year_2016'
const SIGN_IN_URL = 'https://www.runtastic.com/en/d/users/sign_in'
const GPX_URL_PREFIX = 'https://www.runtastic.com/en/users/Timo-Staudinger/sport-sessions/'
const GPX_URL_POSTFIX = '.gpx'

exports.loadRuntasticData = function(account) {
  return new Promise((resolveAll, rejectAll) => {
    console.log(`Signing in as ${account.user}`)
    console.log(`User Id ${account.id}`)
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
            console.log('Success')
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
          console.log('Loading activity data')
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
      activities = activities.filter((activity) => account.meta.activities.indexOf(activity[0]) == -1)
      console.log(`${activities.length} new activities found`)

      account.loadedActivities = []
      let getActivityPromises = []
      activities.forEach((item) => {
        getActivityPromises.push(new Promise((resolve, reject) => {
          try {
            const id = item[0]
            request(GPX_URL_PREFIX + id + GPX_URL_POSTFIX)
              .on('error', console.log)
              .pipe(fs.createWriteStream(`gpx/${id}.gpx`))
              .on('close', () => {
                account.loadedActivities.push(id)
                resolve()
              })
          } catch (e) {
              console.log(e)
          }
        }))
      })
      Promise.all(getActivityPromises).then(() => {
        console.log('All activities loaded')
        resolveAll(account)
      })
    })
  })
}
