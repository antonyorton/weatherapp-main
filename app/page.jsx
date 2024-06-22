//make this landing page automatically take people to the map page

export default function HomePage() {
  return (
    <>
      <a href="/map" className="text-blue-500 font-bold">
        Go to the map page{' '}
      </a>
      <p>This is a NextJS weather app using WeatherAPI and Mapbox</p>
      <div>
        <img src="/images/himawari-latest.jpg" alt="" className="pt-2" />
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
