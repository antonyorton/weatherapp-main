//make this landing page automatically take people to the map page
import Image from 'next/image'
import Link from 'next/link'
import { config } from 'dotenv'
config()
import { get_himawari_date } from '@/lib/get_himawari_date'

const CLOUDFRONT_URL = process.env.MY_AWS_CLOUDFRONT_URL
// export const revalidate = 8 * 60 * 60 // revalidate the page every eight hours
export const fetchCache = 'force-no-store' // don't cache the home page since it quickly goes beyond vercel hobby plan limits

export default function HomePage() {
  // Get datetime for himawari visible images
  const hrs_to_subtract = 1
  const himawari_date = get_himawari_date({ hrs_to_subtract: hrs_to_subtract })
  const local_time = new Date()
  local_time.setHours(local_time.getHours() - hrs_to_subtract)

  return (
    <>
      <a
        href="/map"
        className="text-emerald-500 font-bold text-2xl hover:underline"
      >
        Go to the map page{' '}
      </a>
      <p>This is a NextJS weather app using WeatherAPI and Mapbox.</p>
      <div className="py-2">
        {/* <p>Note: Full disk image has SSL certificate issues, not longer running on AWS */}
        {/* <Link href={CLOUDFRONT_URL + 'satellite/public-hi-res-images/himawari.jpg'}>
          <Image src={CLOUDFRONT_URL + 'satellite/public-hi-res-images/himawari.jpg'} alt="" width="650" height="650" className="rounded" />
        </Link> */}

        <h3 className="font-bold  text-blue-400 mt-5">
          {'Visible satellite over southern Australia and NZ on ' +
            local_time.toUTCString()}
        </h3>
        <p className="text-blue-400 mb-3">(Click to view image)</p>
        <div className="flex flex-row gap-10">
          <Link
            className=" text-red-500 font-bold hover:text-red-200"
            href={
              'https://himawari8-dl.nict.go.jp/himawari8/img/D531106/8d/550/' +
              himawari_date +
              '_3_6.png'
            }
          >
            Adelaide
          </Link>
          <Link
            className=" text-red-500 font-bold hover:text-red-200"
            href={
              'https://himawari8-dl.nict.go.jp/himawari8/img/D531106/8d/550/' +
              himawari_date +
              '_4_6.png'
            }
          >
            Sydney
          </Link>
          <Link
            className=" text-red-500 font-bold hover:text-red-200"
            href={
              'https://himawari8-dl.nict.go.jp/himawari8/img/D531106/8d/550/' +
              himawari_date +
              '_5_6.png'
            }
          >
            Tasman Sea
          </Link>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-lg text-bold font-bold mt-5   text-blue-400">
          Last 24hr of satellite data over Australia
        </p>
        <video width="650" controls className="py-2 rounded">
          <source
            src={CLOUDFRONT_URL + 'satellite/public-videos/aus_snd_.mp4#t=0.1'}
            type="video/mp4"
            className="px-1 rounded"
          />
          Your browser does not support the video tag.
        </video>
        <p className="text-lg text-bold font-bold mt-5 mb-2  text-blue-400">
          Last 24hr of satellite data over Papua New Guinea
        </p>
        <video width="650" controls className="py-2 rounded">
          <source
            src={CLOUDFRONT_URL + 'satellite/public-videos/pia_snd_.mp4#t=0.1'}
            type="video/mp4"
            className="px-1 rounded"
          />
          Your browser does not support the video tag.
        </video>
        <p className="text-lg text-bold font-bold mt-5 mb-2 text-blue-400">
          Last 24hr of satellite data over Indian Ocean
        </p>
        <video width="650" controls className="rounded">
          <source
            src={CLOUDFRONT_URL + 'satellite/public-videos/se1_snd_.mp4#t=0.1'}
            type="video/mp4"
            className="px-1 rounded"
          />
          Your browser does not support the video tag.
        </video>
        <p className="text-lg text-bold font-bold mt-5 mb-2 text-blue-400">
          JMA Target Area Observation (if available)
        </p>
        <img
          className="pb-3"
          width="200"
          height="300"
          src="https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__dsk_0000.jpg"
          alt="location of detailed view"
        />
        <video width="650" controls className="rounded">
          <source
            src={CLOUDFRONT_URL + 'satellite/public-videos/tga_snd_.mp4#t=0.1'}
            type="video/mp4"
            className="px-1 rounded"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex flex-col">
        <h1 className="text-md mt-5">Credits</h1>
        <span className="text-slate-600 text-sm font-bold">
          NASA:{' '}
          <a
            href="https://worldview.earthdata.nasa.gov/"
            className="text-blue-600 hover:underline font-normal"
          >
            https://worldview.earthdata.nasa.gov/
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          Japan Meteorological Agency:{' '}
          <a
            href="https://www.data.jma.go.jp/mscweb/data/himawari/index.html"
            className="text-blue-600 hover:underline font-normal"
          >
            https://www.data.jma.go.jp/mscweb/data/himawari/index.html
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          WeatherAPI:{' '}
          <a
            href="https://www.weatherapi.com/"
            className="text-blue-600 hover:underline font-normal"
          >
            https://www.weatherapi.com/
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          Mapbox:{' '}
          <a
            href="https://www.mapbox.com/blog/streamline-map-development-mapbox-basemap/"
            className="text-blue-600 hover:underline font-normal"
          >
            https://www.mapbox.com/blog/streamline-map-development-mapbox-basemap/
          </a>
        </span>
      </div>
    </>
  )
}
