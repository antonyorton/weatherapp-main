//create a component that will be used to render the page
//for now it just returns "Hello welcome to the [slug] page"
// 'use client'

import MySimplerMap from '@/components/MySimplerMap'
import citiesGeoJson from '@/lib/citiesGeoJson.js'
import Link from 'next/link'
import { config } from 'dotenv'
config()

const mapbox_access_token = process.env.MAPBOX_API_KEY

export const dynamic = 'force-dynamic'

export default async function Page() {
  return (
    <div>
      <Link href="/" className="text-blue-500 font-bold p-3 hover:underline">
        Home
      </Link>
      <MySimplerMap citiesGeoJson={citiesGeoJson} mapbox_access_token={mapbox_access_token} className="rounded-lg" />
      <div>{`Data is updated frequently`}</div>
    </div>
  )
}
