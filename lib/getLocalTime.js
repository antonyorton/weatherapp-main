import { DateTime } from 'luxon'
import tzlookup from 'tz-lookup'
// import { cities } from './fetchWeather.js'

export default function getLocalTime(lat, lon) {
  const timezone = tzlookup(lat, lon)
  const localTime = DateTime.local().setZone(timezone).toJSON().replace('T', ' ').split('.')[0].slice(0, -3)
  return localTime
}

// //test calculateLocalTime()
// cities.forEach(city => {
//   console.log(city.name, calculateLocalTime(city.lat, city.lon))
// })
