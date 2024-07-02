//import and config dotenv
import { config } from 'dotenv'
config()

//dynamic import for chart component since it uses chart.js
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/Chart.jsx'), { ssr: false })

//other non-dynamic imports
import getLocalTime from '@/lib/getLocalTime'
import { getCityData } from '@/lib/getCityData'

// export async function generateStaticParams() {
//   const slugs = await getSlugs()
//   return slugs.map(item => ({ slug: item }))
// }

export const revalidate = 3600

export default function ChartGroup({ weather }) {
  const mycity = weather[0].city

  //get city details
  const cityData = getCityData(mycity)
  //get local time of the city
  const localTime = getLocalTime(cityData.lat, cityData.lon)

  return (
    <div className="bg-white-500 text-justify max-w-[1000px]">
      <span className="flex flex-row justify-center text-slate-600 mt-7">
        <h1 className="flex text-m font-bold py-3">{`${cityData.name}, ${cityData.country}`}</h1>
        <h2 className="p-3">{` ${localTime} (local time)`}</h2>
      </span>

      <div className="flex flex-col h-full justify-center p-2 max-w-[1000px]">
        <h2 className="px-4">Temperature</h2>
        <Chart data={weather} weatherVariable="temp_c" num_days="7" />
        <h2 className="py-1 px-4">Humidity</h2>
        <Chart data={weather} weatherVariable="humidity" num_days="7" />
        <h2 className="py-1 px-4">Pressure</h2>
        <Chart data={weather} weatherVariable="pressure_mb" num_days="7" />
      </div>
    </div>
  )
}
