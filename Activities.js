'use strict'

const RuntasticActivities = {
  RUNNING: 1,
  NORDIC_WALKING: 2,
  CYCLING: 3,
  MOUNTAIN_BIKING: 4,
  OTHER: 5,
  SKATING: 6,
  HIKING: 7,
  CROSS_COUNTRY_SKIING: 8,
  SKIING: 9,
  SNOW_BOARDING: 10,
  MOTORBIKING: 11,
  DRIVING: 12,
  SNOWSHOEING: 13,
  RUNNING_TREADMILL: 14,
  CYCLING_ERGOMETER: 15,
  ELLIPTICAL: 16,
  ROWING: 17,
  SWIMMING: 18,
  WALKING: 19,
  RIDING: 20,
  GOLFING: 21,
  RACE_CYCLING: 22,
  TENNIS: 23,
  BADMINTON: 24,
  SQUASH: 25,
  YOGA: 26,
  AEROBICS: 27,
  MARTIAL_ARTS: 28,
  SAILING: 29,
  WINDSURFING: 30,
  PILATES: 31,
  CLIMBING: 32,
  FRISBEE: 33,
  STRENGTH_TRAINING: 34,
  VOLLEYBALL: 35,
  HANDBIKE: 36,
  CROSS_SKATING: 37,
  SOCCER: 38,
  SMOVEY_WALKING: 39,
  SMOVEY_EXCERCISING: 40,
  NORDIC_CROSS_SKATING: 41,
  SURFING: 42,
  KITE_SURFING: 43,
  KAYAKING: 44,
  BASKETBALL: 45,
  SPINNING: 46,
  PARAGLIDING: 47,
  WAKE_BOARDING: 48,
  FREECROSSEN: 49,
  DIVING: 50,
  TABLE_TENNIS: 51,
  HANDBALL: 52,
  BACK_COUNTRY_SKIING: 53,
  ICE_SKATING: 54,
  SLEDDING: 55,
  SNOWMAN_BUILDING: 56,
  SNOWBALL_FIGHT: 57,
  CURLING: 58,
  ICE_STOCK: 59,
  BIATHLON: 60,
  KITE_SKIING: 61,
  SPEED_SKIING: 62,
  PUSH_UPS: 63,
  SIT_UPS: 64,
  PULL_UPS: 65,
  SQUATS: 66,
  AMERICAN_FOOTBALL: 67,
  BASEBALL: 68,
  CROSSFIT: 69,
  DANCING: 70,
  ICE_HOCKEY: 71,
  SKATEBOARDING: 72,
  ZUMBA: 73,
  GYMNASTICS: 74,
  RUGBY: 75,
  STANDUP_PADDLING: 76,
  SIX_PACK_WORKOUT: 77,
  BUTT_TRAINER_WORKOUT: 78,
  LEG_TRAINER_WORKOUT: 80,
  RESULTS_WORKOUT: 81
}
exports.RuntasticActivities = RuntasticActivities

const StravaActivities = {
  CYCLING: 'ride',
  RUNNING: 'run',
  SWIMMING: 'swim',
  WORKOUT: 'workout',
  HIKING: 'hike',
  WALKING: 'walk',
  NORDIC_SKIING: 'nordicski',
  ALPINE_SKIING: 'alpineski',
  BACK_COUNTRY_SKIING: 'backcountryski',
  ICE_SKATING: 'iceskate',
  INLINE_SKATING: 'inlineskate',
  KITE_SURFING: 'kitesurf',
  ROLLER_SKIING: 'rollerski',
  WINDSURFING: 'windsurf',
  SNOW_BOARDING: 'snowboard',
  SNOWSHOEING: 'snowshoe',
  EBIKE_RIDING: 'ebikeride',
  VIRTUAL_RIDING: 'virtualride'
}
exports.StravaActivities = StravaActivities

exports.mapRuntasticToStrava = function(runtasticActivity) {
  let stravaActivity = undefined
  switch (runtasticActivity) {
    case RuntasticActivities.RUNNING:
      stravaActivity = StravaActivities.RUNNING
      break
    case RuntasticActivities.CYCLING:
      stravaActivity = StravaActivities.CYCLING
      break
  }
  return stravaActivity
}
