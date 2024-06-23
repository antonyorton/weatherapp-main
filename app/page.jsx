//make this landing page automatically take people to the map page
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <a href="/map" className="text-blue-500 font-bold">
        Go to the map page{' '}
      </a>
      <p>This is a NextJS weather app using WeatherAPI and Mapbox</p>
      <div className="py-2">
        <Link href="/images/himawari-latest.jpg">
          <Image src="/images/himawari-latest.jpg" alt="" width="900" height="900" className="rounded" />
        </Link>
      </div>
      <span className="flex flex-col md:flex-row">
        <video width="440" height="315" controls className="p-2">
          <source src="/videos/fd_cve.mp4#t=0.1" type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
        <video width="450" height="315" controls className="p-2">
          <source src="/videos/aus_cve.mp4#t=0.1" type="video/mp4" className="px-1 rounded" />
          Your browser does not support the video tag.
        </video>
      </span>

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
        <br />
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
