//a small program to get the locale date and return a Himawari format date string
//can probably be modified and used to input an AUD date time and return the corresponding JMA time
//in Himawari format

export function get_himawari_date({ hrs_to_subtract = 0 } = {}) {
  const now = new Date()

  // Get UTC date
  const [utcyear, utcmonth, utcday] = [
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ]
  const [utchour, utcmin, utcsec] = [
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ]
  const nowUTC = new Date(utcyear, utcmonth, utcday, utchour, utcmin, utcsec)

  let now_minused = new Date(nowUTC.valueOf())
  //subtract 'hrs_to_subtract' hours
  now_minused.setHours(now_minused.getHours() - hrs_to_subtract)
  // round minutes to nearest 10 lower
  let temp_minutes = now_minused.getMinutes()
  now_minused.setMinutes(temp_minutes - (temp_minutes % 10))
  //set seconds to zero
  now_minused.setSeconds(0)
  const dateLocalString = now.toString()
  const dateString = now_minused.toLocaleDateString()
  const timeString = now_minused.toLocaleTimeString()
  // console.log(dateString)
  console.log(timeString)
  console.log(timeString.split(' ')[0].replaceAll(':', ''))

  //get day, month, year and time
  const [day, month, year] = dateString.split('/')
  let time = timeString.split(' ')[0].replaceAll(':', '')
  // make time 24hr format
  const am_pm = timeString.split(' ')[1]
  if (am_pm == 'pm') {
    time = parseInt(time) + 120000
    time = time.toString()
  }

  ;('add a zero to the front if required so the time always has six digits')
  if (time.length < 6) {
    time = '0' + time
  }

  //put in Himawari format
  const output = `${year}/${month}/${day}/${time}`

  return output
}

// const myDate = get_himawari_date({ hrs_to_subtract: 1 })
// console.log('The current date and time at your locale is: ', myDate)
