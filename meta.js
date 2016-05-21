'use strict'

const fs = require('fs')

const initialMeta = {
  activities: [],
  history: []
}

exports.readMeta = function(id) {
  let metaString = undefined

  try {
    metaString = fs.readFileSync(`meta/${id}`, {encoding: 'utf8'})
  } catch(e) {}

  if(metaString) {
    return JSON.parse(metaString)
  } else {
    return initialMeta
  }
}

exports.writeMeta = function(id, meta) {
  fs.writeFileSync(`meta/${id}`, JSON.stringify(meta), 'utf8')
}

exports.addActivities = function(meta, activities) {
  if(activities.length === 0) return meta

  return {
    activities: meta.activities.concat(activities),
    history: meta.history.concat({
      timestamp: Date.now(),
      activities: activities
    })
  }
}
