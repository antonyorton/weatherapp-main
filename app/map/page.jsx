//a component that fetches data for the map page
import citiesGeoJson from '@/lib/citiesGeoJson.js'
import MyMap from '@/components/MyMap'

import { fetchWeather } from '@/lib/fetchWeather.js'

//import and configure dotenv
import { config } from 'dotenv'
config()

const mapbox_access_token = process.env.MAPBOX_API_KEY

export default async function MapPage() {
  //fetch weather data for all cities via async iterator
  const weatherData = {}
  for await (const city of citiesGeoJson.features) {
    const cityName = city.properties.name
    const weather = await fetchWeather(cityName)
    weatherData[cityName] = weather //create an array of objects with key=city name and value=weather data
  }

  return (
    <div className="bg-slate-200 text-justify rounded-xl">
      <div className="bg-slate-100 rounded">
        <MyMap citiesGeoJson={citiesGeoJson} allWeatherData={weatherData} mapbox_access_token={mapbox_access_token} className="rounded-lg" />
      </div>
    </div>
  )
}