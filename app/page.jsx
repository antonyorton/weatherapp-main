//make this landing page automatically take people to the map page

export default function HomePage() {
  return (
    <>
      <a href="/map" className="text-blue-500 font-bold">
        Go to the map page
      </a>
      <p>This is a simple NextJS weather app</p>
      <p>It uses WeatherAPI and Mapox</p>
    </>
  )
}
