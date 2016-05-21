'use strict'

const loadRuntasticData = require('./runtastic').loadRuntasticData
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
      id: id,
      meta: meta
    }
  })
  .map((account) => {
    loadRuntasticData(account)
      .then((account) => {
        const meta = addActivities(account.meta, account.loadedActivities)
        writeMeta(account.id, meta)
      })
    })
