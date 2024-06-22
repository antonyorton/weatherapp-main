import dotenv from 'dotenv'
dotenv.config()

export async function fetchWeather(slug) {
  const MY_AWS_CLOUDFRONT_URL = process.env.MY_AWS_CLOUDFRONT_URL
  const url = MY_AWS_CLOUDFRONT_URL + slug.toLowerCase().replaceAll('%20', '-').replaceAll(' ', '-') + '.json'
  //fetching data from AWS cloudfront and return as a json object
  //stream data from the url to a response object
  //revalidate the cache every 3600 seconds (1 hour)
  const response = await fetch(url, { next: { revalidate: 3600 } })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const weather = await response.json()
  // console.log(weather[weather.length - 1])
  // console.log('lib [fetchWeather], weather.length: ', weather.length)
  return weather
}

//a list of 42 international cities including Sydney with their respective latitude and longitude
export const cities = [
  { name: 'Sydney', lat: -33.865143, lon: 151.2099, country: 'Australia' },
  { name: 'Melbourne', lat: -37.814, lon: 144.96332, country: 'Australia' },
  { name: 'Brisbane', lat: -27.470125, lon: 153.021072, country: 'Australia' },
  { name: 'Perth', lat: -31.950527, lon: 115.860457, country: 'Australia' },
  { name: 'Adelaide', lat: -34.92818, lon: 138.59993, country: 'Australia' },
  { name: 'Gold Coast', lat: -28.00029, lon: 153.43088, country: 'Australia' },
  { name: 'Newcastle', lat: -32.92667, lon: 151.77647, country: 'Australia' },
  { name: 'Canberra', lat: -35.28346, lon: 149.12807, country: 'Australia' },
  { name: 'Wollongong', lat: -34.424, lon: 150.893, country: 'Australia' },
  { name: 'Geelong', lat: -38.14711, lon: 144.36069, country: 'Australia' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'Berlin', lat: 52.52, lon: 13.405, country: 'Germany' },
  { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'Italy' },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, country: 'Spain' },
  { name: 'Amsterdam', lat: 52.3702, lon: 4.8952, country: 'Netherlands' },
  { name: 'Vienna', lat: 48.2082, lon: 16.3738, country: 'Austria' },
  { name: 'Athens', lat: 37.9838, lon: 23.7275, country: 'Greece' },
  { name: 'Stockholm', lat: 59.3293, lon: 18.0686, country: 'Sweden' },
  { name: 'Oslo', lat: 59.9139, lon: 10.7522, country: 'Norway' },
  { name: 'Copenhagen', lat: 55.6761, lon: 12.5683, country: 'Denmark' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6176, country: 'Russia' },
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917, country: 'Japan' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { name: 'Seoul', lat: 37.5665, lon: 126.978, country: 'South Korea' },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  { name: 'Kuala Lumpur', lat: 3.139, lon: 101.6869, country: 'Malaysia' },
  { name: 'Jakarta', lat: -6.2088, lon: 106.8456, country: 'Indonesia' },
  { name: 'Manila', lat: 14.5995, lon: 120.9842, country: 'Philippines' },
  { name: 'New York', lat: 40.7128, lon: -74.006, country: 'United States' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'United States' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'United States' },
  { name: 'Toronto', lat: 43.651, lon: -79.347, country: 'Canada' },
  { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'Mexico' },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, country: 'Argentina' },
  { name: 'Santiago', lat: -33.4489, lon: -70.6693, country: 'Chile' },
  { name: 'Lima', lat: -12.0464, lon: -77.0428, country: 'Peru' },
  { name: 'Cape Town', lat: -33.9249, lon: 18.4241, country: 'South Africa' },
  { name: 'Nairobi', lat: -1.2864, lon: 36.8172, country: 'Kenya' },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777, country: 'India' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'United Arab Emirates' }
]

//get a list of city names
export async function getSlugs() {
  //get each city name and return as a list
  const slugs = cities.map(item => item.name)
  return slugs
}

//return the latitude and longitude of a city
export function getCityData(slug) {
  const city = cities.find(item => item.name === slug)
  return city
}
