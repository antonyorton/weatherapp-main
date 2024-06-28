'use client'
//a component to render a mapboxgl map
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { fetchWeather } from '@/lib/fetchWeather'
import ChartGroup from './ChartGroup'

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

export default function MySimplerMap({ citiesGeoJson, allWeatherData, mapbox_access_token, className }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const [weather, setWeather] = useState([])

  //async wrapper to fetch weather data
  const fetchWeatherInline = async cityName => {
    try {
      const response = await fetchWeather(cityName)
      setWeather(response) // Update state with fetched weather data
    } catch (error) {
      console.error('Failed to fetch weather data', error)
    }
  }

  const handleCityClick = e => {
    const cityName = e.features[0].properties.name
    fetchWeatherInline(cityName)
  }

  useEffect(() => {
    mapboxgl.accessToken = mapbox_access_token

    if (!mapContainer.current) return // Guard clause to ensure the container exists

    const mymap = new mapboxgl.Map({
      container: mapContainer.current, // container ID
      style: {
        version: 8,
        imports: [
          {
            id: 'basemap',
            url: 'mapbox://styles/mapbox/standard',
            //add configuration options
            config: {
              // lightPreset: lightingMode,
              showPointOfInterestLabels: false
            }
          }
        ],
        sources: {},
        layers: []
      },
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf', // required for rendering text labels
      center: [140, -33], // starting position [lng, lat]
      zoom: 4, // starting zoom
      projection: 'globe',
      antialias: true,
      backgroundColor: 'transparent' // set background color to transparent
    })

    mymap.on('load', () => {
      //add the countries to the map
      addMapboxData(mymap, 'countries', 'mapbox://mapbox.country-boundaries-v1', 'country_boundaries', 'white', 0.1, 0.7)

      //add the geojson cities to the map
      addMapboxData(mymap, 'cities', citiesGeoJson, null, 'red', 1.5, 0.8, 'geojson')

      //add the geojson labels to the map
      addGeoJsonLabels(mymap, 'city-labels', citiesGeoJson)
    })

    // Change the cursor to a pointer when the mouse is over the cities layer.
    mymap.on('mouseenter', 'cities', () => {
      mymap.getCanvas().style.cursor = 'pointer'
    })

    // Change it back to a pointer when it leaves.
    mymap.on('mouseleave', 'cities', () => {
      mymap.getCanvas().style.cursor = ''
    })

    mymap.on('click', 'cities', handleCityClick)
  }, [])

  return (
    <div className="flex flex-col justify-center">
      <div ref={mapContainer} className="h-full min-h-[450px] sm:min-h-[620px] rounded-lg "></div>
      {weather.length > 0 ? <ChartGroup className="h-full min-h-[768px]" weather={weather} /> : <p>Select a city to view the latest weather</p>}
    </div>
  )
}
