//a component that fetches data for the map page
import { revalidatePath } from 'next/cache'

import citiesGeoJson from '@/lib/citiesGeoJson.js'
import MyMap from '@/components/MyMap'
import { fetchWeather } from '@/lib/fetchWeather.js'
import Link from 'next/link'
//import and configure dotenv
import { config } from 'dotenv'
config()

export const maxDuration = 30 // This function can run for a maximum of 30 seconds on Vercel hosting
// export const dynamic = 'force-dynamic' // force dynamic rendering on Vercel hosting
export const revalidate = 3600 // revalidate the page every hour

const mapbox_access_token = process.env.MAPBOX_API_KEY

export default async function MapPage() {
  // revalidatePath('/map') //revalidate the page every time it is visited

  //fetch weather data for all cities via async iterator
  const weatherData = {}
  for await (const city of citiesGeoJson.features) {
    const cityName = city.properties.name
    const weather = await fetchWeather(cityName)
    weatherData[cityName] = weather //create an array of objects with key=city name and value=weather data
  }

  return (
    <div>
      <Link href="/" className="text-blue-500 font-bold p-3 hover:underline">
        Home
      </Link>
      <div className="bg-slate-100 text-justify rounded-xl flex flex-col justify-center">
        <MyMap citiesGeoJson={citiesGeoJson} allWeatherData={weatherData} mapbox_access_token={mapbox_access_token} className="rounded-lg" />
      </div>
    </div>
  )
}
