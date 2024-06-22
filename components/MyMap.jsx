'use client'
//a component to render a mapboxgl map
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// import './mymap_styles.css' //styling for the popups (TODO: try to move to tailwind)
import ChartGroup from './ChartGroup'

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime())
  previous.setDate(date.getDate() - 1)
  return previous
}

//function to get the tile path for the current and previous day
function getGibsTilePaths() {
  //get current UTC date then output in ISO format yyyy-mm-dd
  let SatteliteUTCDate = new Date()
  let SatteliteUTCDate_previousDay = getPreviousDay(SatteliteUTCDate)

  SatteliteUTCDate = SatteliteUTCDate.toISOString().split('T')[0]
  SatteliteUTCDate_previousDay = SatteliteUTCDate_previousDay.toISOString().split('T')[0]
  // console.log('SatteliteUTCDate:', SatteliteUTCDate)
  // console.log('SatteliteUTCDate_previousDay:', SatteliteUTCDate_previousDay)

  //TODO, see if we can get more up to date imagery (currently using the date in LA)
  const tilePath = 'wmts/epsg3857/best/' + 'VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/' + `${SatteliteUTCDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`
  //previous day tile path
  const tilePathPreviousDay = 'wmts/epsg3857/best/' + 'VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/' + `${SatteliteUTCDate_previousDay}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`

  return { tilePath, tilePathPreviousDay }
}

//function to add a mapbox or geojson data source to the map
function addMapboxData(map, id, sourceData, sourceLayer, lineColor, lineWidth, opacity = 0.8, type = 'vector') {
  // Add a mapbox (vector) or geojson data source to the map
  map.addSource(id, {
    type: type,
    ...(type === 'vector' ? { url: sourceData } : { data: sourceData })
  })

  if (type === 'vector') {
    map.addLayer({
      id: id,
      type: 'line',
      source: id,
      'source-layer': sourceLayer,
      paint: {
        'line-color': lineColor,
        'line-width': lineWidth
      }
    })
  } else if (type === 'geojson') {
    let mygeometry = sourceData.features[0].geometry.type
    switch (mygeometry) {
      case 'Point':
        // Handle Point geometry
        map.addLayer({
          id: id,
          type: 'circle',
          source: id,
          paint: {
            'circle-radius': 6,
            'circle-color': '#dbbe3e',
            'circle-opacity': opacity,
            'circle-stroke-width': lineWidth,
            'circle-stroke-color': lineColor
          }
        })

        break
      case 'LineString':
        // Handle LineString geometry
        map.addLayer({
          id: id,
          type: 'line',
          source: id,
          paint: {
            'line-color': lineColor,
            'line-width': lineWidth,
            'line-opacity': opacity
          }
        })

        break
      case 'Polygon':
        // Handle Polygon geometry
        console.warn(`Unsupported geometry type: ${mygeometry}`)
        break
      default:
        console.warn(`Unsupported geometry type: ${mygeometry}`)
    }
  }
}

function addGeoJsonLabels(map, id, sourceData) {
  // Add a geojson data source to the map
  map.addSource(id, {
    type: 'geojson',
    data: sourceData
  })

  // Add a layer for the geojson data source
  map.addLayer({
    id: id,
    type: 'symbol',
    source: id,
    layout: {
      'text-field': ['get', 'name'],
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'symbol-z-order': 'viewport-y' // Ensures the labels are drawn above other layers
    },
    paint: {
      'text-color': '#000000',
      'text-halo-color': '#ffffff', // Adds a white halo
      'text-halo-width': 2, // Adjusts the width of the halo
      'text-halo-blur': 1 // Adjusts the blur of the halo
    }
  })
}

export default function MyMap({ citiesGeoJson, allWeatherData, mapbox_access_token, className }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [lightingMode, setLightingMode] = useState('light') // Default to light mode

  //get the tilepaths for the current and previous day
  const { tilePath, tilePathPreviousDay } = getGibsTilePaths()

  // const style1 = 'mapbox://styles/mapbox/standard' // Use Mapbox's standard imagery

  // const style2 = 'mapbox://styles/mapbox/streets-v11' // Use Mapbox's satellite imagery

  // //NASA satellite imagery
  // const style3 = {
  //   version: 8,
  //   imports: [
  //     {
  //       id: 'basemap',
  //       url: 'mapbox://styles/mapbox/standard',
  //       //add configuration options
  //       config: {
  //         lightPreset: 'dusk',
  //         showPointOfInterestLabels: false
  //       }
  //     }
  //   ],
  //   sources: {
  //     gibs: {
  //       type: 'raster',
  //       tiles: ['https://gibs-a.earthdata.nasa.gov/' + tilePathPreviousDay, 'https://gibs-b.earthdata.nasa.gov/' + tilePathPreviousDay, 'https://gibs-c.earthdata.nasa.gov/' + tilePathPreviousDay],
  //       tileSize: 128
  //     },
  //     mapbox_streets: {
  //       type: 'vector',
  //       url: 'mapbox://mapbox.mapbox-streets-v8' // Mapbox Streets vector tile source
  //     },
  //     mapbox_satelitte: {
  //       type: 'raster',
  //       url: 'mapbox://styles/mapbox/satellite-v9' // Mapbox Satellite raster tile source
  //     },
  //     mapbox_streets_raster: {
  //       type: 'raster',
  //       tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
  //       tileSize: 256,
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     }
  //   },
  //   layers: [
  //     {
  //       id: 'gibs',
  //       type: 'raster',
  //       source: 'gibs',
  //       minzoom: 0,
  //       maxzoom: 6,
  //       paint: {
  //         'raster-opacity': 1 // Add this line
  //       }
  //     },
  //     {
  //       id: 'roads',
  //       type: 'line',
  //       source: 'mapbox_streets',
  //       'source-layer': 'road', // Use the 'road' layer from Mapbox Streets
  //       paint: {
  //         'line-color': '#808080', // Set the color of the roads to medium grey
  //         'line-width': 0.2 // Set the width of the roads
  //       }
  //     }
  //   ]
  // }

  // Function to toggle the lighting mode
  const toggleLightingMode = () => {
    console.log('Toggling lighting mode')

    setLightingMode(prevMode => {
      //scroll between prevMode = dawn, noon, dusk, and night
      console.log('prevMode:', prevMode)
      switch (prevMode) {
        case 'dusk':
          setLightingMode('noon')
          return
        case 'noon':
          setLightingMode('dusk')
          return
        default:
          setLightingMode('noon')
          return
      }
    })
  }

  useEffect(() => {
    mapboxgl.accessToken = mapbox_access_token

    // Get the current map container
    const currentMap = mapInstance.current
    //get the current view state
    let currentState = null
    if (currentMap) {
      currentState = {
        center: currentMap.getCenter(),
        zoom: currentMap.getZoom(),
        pitch: currentMap.getPitch(),
        bearing: currentMap.getBearing()
      }
    }

    const mymap = new mapboxgl.Map({
      container: mapContainer.current, // container ID
      // style: style3, // Use Mapbox's satellite imagery
      //The style object is the most important part of the map configuration
      style: {
        version: 8,
        imports: [
          {
            id: 'basemap',
            url: 'mapbox://styles/mapbox/standard',
            //add configuration options
            config: {
              lightPreset: lightingMode,
              showPointOfInterestLabels: false
            }
          }
        ],
        sources: {
          gibs: {
            type: 'raster',
            tiles: ['https://gibs-a.earthdata.nasa.gov/' + tilePathPreviousDay, 'https://gibs-b.earthdata.nasa.gov/' + tilePathPreviousDay, 'https://gibs-c.earthdata.nasa.gov/' + tilePathPreviousDay],
            tileSize: 128
          },
          mapbox_streets: {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8' // Mapbox Streets vector tile source
          },
          mapbox_satelitte: {
            type: 'raster',
            url: 'mapbox://styles/mapbox/satellite-v9' // Mapbox Satellite raster tile source
          },
          mapbox_streets_raster: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'gibs',
            type: 'raster',
            source: 'gibs',
            minzoom: 0,
            maxzoom: 8,
            paint: {
              'raster-opacity': 1 // Add this line
            }
          },
          {
            id: 'roads',
            type: 'line',
            source: 'mapbox_streets',
            'source-layer': 'road', // Use the 'road' layer from Mapbox Streets
            paint: {
              'line-color': '#808080', // Set the color of the roads to medium grey
              'line-width': 0.2 // Set the width of the roads
            }
          }
        ]
      },
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf', // add this line
      center: [140, -33], // starting position [lng, lat]
      zoom: 4, // starting zoom
      projection: 'globe',
      antialias: true,
      backgroundColor: 'transparent' // set background color to transparent
    })

    // //change the style.imports.config.lightPreset to mapboxLightStyle
    // const currentLightPreset = mymap.getStyle().imports[0].config.lightPreset
    // console.log('currentLightPreset:', currentLightPreset)
    // console.log('mapboxLightStyle:', mapboxLightStyle)
    // mymap.setStyle({
    //   ...mymap.getStyle(),
    //   imports: [
    //     {
    //       ...mymap.getStyle().imports[0],
    //       config: {
    //         ...mymap.getStyle().imports[0].config,
    //         lightPreset: mapboxLightStyle
    //       }
    //     }
    //   ]
    // })

    mymap.on('load', () => {
      //add the countries to the map
      addMapboxData(mymap, 'countries', 'mapbox://mapbox.country-boundaries-v1', 'country_boundaries', 'white', 0.1, 0.7)

      //add the geojson cities to the map
      addMapboxData(mymap, 'cities', citiesGeoJson, null, 'red', 1.5, 0.8, 'geojson')

      //add the geojson labels to the map
      addGeoJsonLabels(mymap, 'city-labels', citiesGeoJson)
    })

    // mymap.addSource('countries', {
    //   type: 'vector',
    //   url: 'mapbox://mapbox.country-boundaries-v1'
    // })

    // mymap.addLayer({
    //   id: 'countries',
    //   type: 'line',
    //   source: 'countries',
    //   'source-layer': 'country_boundaries',
    //   paint: {
    //     'line-color': 'black',
    //     'line-width': 0.2
    //   }
    // })

    // map.moveLayer('gibs', 'countries') //moves the countries layer above the gibs layer NOT SURE IF NECCESSARY

    //add the cities to the map
    //each having a label given by the citie.prporties.name

    // mymap.addSource('cities', {
    //   type: 'geojson',
    //   data: citiesGeoJson
    // })

    // mymap.addLayer({
    //   id: 'cities',
    //   type: 'circle',
    //   source: 'cities',
    //   paint: {
    //     'circle-radius': 7,
    //     'circle-color': 'green',
    //     'circle-opacity': 0.7,
    //     'circle-stroke-width': 1,
    //     'circle-stroke-color': 'black'
    //   }
    // })

    // // Add a popup to each city on map load
    // citiesGeoJson.features.forEach(function (city) {
    //   const coordinates = city.geometry.coordinates
    //   const name = city.properties.name
    //   const nameHTML = name.replace(' ', '-')
    //   const country = city.properties.country

    //   new mapboxgl.Popup({
    //     className: 'my-custom-popup',
    //     closeButton: false,
    //     closeOnClick: false,
    //     anchor: 'left' // Anchor the popup to the left, so it appears to the right of the point
    //   })
    //     .setLngLat(coordinates)
    //     // .setHTML(`<a href=/charts/${nameHTML} target="_blank">${name}</a>`)
    //     .setHTML(`<p>My name is ${name}</p>`) //dummy one with no link
    //     .addTo(mymap)
    // })

    // Change the cursor to a pointer when the mouse is over the cities layer.

    mymap.on('mouseenter', 'cities', () => {
      mymap.getCanvas().style.cursor = 'pointer'
    })

    // Change it back to a pointer when it leaves.
    mymap.on('mouseleave', 'cities', () => {
      mymap.getCanvas().style.cursor = ''
    })

    //Restore the view state after the lighting style has loaded
    mymap.on('style.load', () => {
      mymap.flyTo({
        center: currentState.center,
        zoom: currentState.zoom,
        pitch: currentState.pitch,
        bearing: currentState.bearing
      })
    })

    mapInstance.current = mymap
    return () => mymap.remove()
  }, [lightingMode])

  useEffect(() => {
    // Check if mapInstance.current is defined and has an 'on' method
    if (mapInstance.current && typeof mapInstance.current.on === 'function') {
      // Add a click event on the cities layer
      mapInstance.current.on('click', 'cities', function (e) {
        // Prevent the default link click action
        e.preventDefault()
        // Get the city name from the clicked feature
        const cityName = e.features[0].properties.name
        // Update the selected city state
        setSelectedCity(cityName)
      })

      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        if (mapInstance.current) {
          mapInstance.current.off('click', 'cities')
        }
      }
    }
  }, [lightingMode])

  const defaultView = {
    center: [150, -20],
    zoom: 2,
    bearing: 0,
    pitch: 0
  }

  const flyToDefault = () => {
    mapInstance.current.flyTo(defaultView)
  }

  return (
    <div className="flex flex-col justify-center">
      <div ref={mapContainer} className="h-full min-h-[450px] sm:min-h-[800px] rounded-lg ">
        <img src="/images/north-toggle.png" alt="North sign" style={{ zIndex: 1000, width: '35px', height: '35px' }} className="h-full absolute left-0 top-0 transform translate-x-4 translate-y-4 hover:opacity-75 cursor-pointer" onClick={() => flyToDefault()} />
      </div>
      <button onClick={toggleLightingMode} className="hover:font-bold">
        Toggle Lighting Mode
      </button>
      {selectedCity ? <ChartGroup className="h-full min-h-[768px]" weather={allWeatherData[selectedCity]} /> : <p>Click on a city to see the recent weather ..</p>}
    </div>
  )
}
