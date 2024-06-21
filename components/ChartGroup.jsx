//import and config dotenv
import { config } from 'dotenv'
config()

//dynamic import for chart component since it uses chart.js
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/Chart.jsx'), { ssr: false })

//other non-dynamic imports
import { fetchWeather, getSlugs, getCityData } from '@/lib/fetchWeather.js'
import getLocalTime from '@/lib/getLocalTime'
import urlSlugToCity from '@/lib/urlSlugToCity.js'

// export async function generateStaticParams() {
//   const slugs = await getSlugs()
//   return slugs.map(item => ({ slug: item }))
// }

export default function ChartGroup({ weather }) {
  const mycity = weather[0].city
  console.log('[ChartGroup] mycity:', mycity)
  //get city details
  const cityData = getCityData(mycity)
  //get local time of the city
  const localTime = getLocalTime(cityData.lat, cityData.lon)

  //fetching data from AWS cloudfront
  // const weather = await fetchWeather(city)

  return (
    <div className="bg-white-500 text-justify mx-2 w-full">
      <span className="flex flex-row justify-center text-slate-600 my-2">
        <h1 className="flex text-m font-bold px-3">{`${cityData.name}, ${cityData.country}`}</h1>
        <h2 className="py-1">{`${localTime} (local time)`}</h2>
      </span>

      <div className="flex flex-col lg:flex-row justify-center">
        {/* <h2 className="px-4">Temperature</h2> */}
        <div className="flex-1">
          <Chart data={weather} weatherVariable="temp_c" num_days="7" />
        </div>
        <div className="flex-1">
          {/* <h2 className="py-1 px-4">Humidity</h2> */}
          <Chart data={weather} weatherVariable="humidity" num_days="7" />
        </div>
        <div className="flex-1">
          {/* <h2 className="py-1 px-4">Pressure</h2> */}
          <Chart data={weather} weatherVariable="pressure_mb" num_days="7" />
        </div>
      </div>
      {/* <img src="/images/cumulonibus.jpg" alt="" className="pt-2" /> */}
    </div>
  )
}
