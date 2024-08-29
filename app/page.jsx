//make this landing page automatically take people to the map page
import Image from 'next/image'
import Link from 'next/link'
import { config } from 'dotenv'
config()

const CLOUDFRONT_URL = process.env.MY_AWS_CLOUDFRONT_URL
// export const revalidate = 8 * 60 * 60 // revalidate the page every eight hours
export const fetchCache = 'force-no-store' // don't cache the home page since it quickly goes beyond vercel hobby plan limits

export default function HomePage() {
  return (
    <>
      <a href="/map" className="text-blue-500 font-bold">
        Go to the map page{' '}
      </a>
      <p>This is a NextJS weather app using WeatherAPI and Mapbox.</p>
      <p>Imagery, videos and weather data are live and updated hourly.</p>
      <p>Satellite imagery is from the Japan Meteorological Agency.</p>
      <div className="py-2">
        {/* <p>Note: Full disk image no longer visible. Himawari 8 link appears to be down since 23 August 2024. This may be repaired in future.</p> */}
        <Link href={CLOUDFRONT_URL + 'satellite/public-hi-res-images/himawari.jpg'}>
          <Image src={CLOUDFRONT_URL + 'satellite/public-hi-res-images/himawari.jpg'} alt="" width="1800" height="1800" className="rounded" />
        </Link>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl text-bold font-bold mt-5">Australia</p>
        <video width="900" controls className="py-2 rounded">
          <source src={CLOUDFRONT_URL + 'satellite/public-videos/aus_snd_.mp4#t=0.1'} type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
        <p className="text-2xl text-bold font-bold mt-5">Papua New Guinea</p>
        <video width="900" controls className="py-2 rounded">
          <source src={CLOUDFRONT_URL + 'satellite/public-videos/pia_snd_.mp4#t=0.1'} type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
        <p className="text-2xl text-bold font-bold mt-5">Indian Ocean</p>
        <video width="900" controls className="rounded">
          <source src={CLOUDFRONT_URL + 'satellite/public-videos/se1_snd_.mp4#t=0.1'} type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
        <p className="text-2xl text-bold font-bold mt-5">JMA Target Area Observation (if available)</p>
        <img width="250" height="300" src="https://www.data.jma.go.jp/mscweb/data/himawari/img/fd_/fd__dsk_0000.jpg" alt="location of detailed view" />
        <video width="900" controls className="rounded">
          <source src={CLOUDFRONT_URL + 'satellite/public-videos/tga_snd_.mp4#t=0.1'} type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex flex-col">
        <h1 className="text-md mt-5">Credits</h1>
        <span className="text-slate-600 text-sm font-bold">
          NASA:{' '}
          <a href="https://worldview.earthdata.nasa.gov/" className="text-blue-600 hover:underline font-normal">
            https://worldview.earthdata.nasa.gov/
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          Japan Meteorological Agency:{' '}
          <a href="https://www.data.jma.go.jp/mscweb/data/himawari/index.html" className="text-blue-600 hover:underline font-normal">
            https://www.data.jma.go.jp/mscweb/data/himawari/index.html
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          WeatherAPI:{' '}
          <a href="https://www.weatherapi.com/" className="text-blue-600 hover:underline font-normal">
            https://www.weatherapi.com/
          </a>
        </span>
        <span className="text-slate-600 text-sm font-bold">
          Mapbox:{' '}
          <a href="https://www.mapbox.com/blog/streamline-map-development-mapbox-basemap/" className="text-blue-600 hover:underline font-normal">
            https://www.mapbox.com/blog/streamline-map-development-mapbox-basemap/
          </a>
        </span>
      </div>
    </>
  )
}
