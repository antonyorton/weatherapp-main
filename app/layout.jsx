import '@/app/globals.css'
// import MapPage from './map/page'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="px-4 py-2">
        {/* <header>[Header]</header> */}
        <main className="py-3">{children}</main>
        {/* <footer>[Footer]</footer> */}
      </body>
    </html>
  )
}
