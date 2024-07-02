'use server'
import dotenv from 'dotenv'
dotenv.config()

export async function fetchWeather(slug) {
  const MY_AWS_CLOUDFRONT_URL = process.env.MY_AWS_CLOUDFRONT_URL

  const url = MY_AWS_CLOUDFRONT_URL + slug.toLowerCase().replaceAll('%20', '-').replaceAll(' ', '-') + '.json'

  const response = await fetch(url, { next: { revalidate: 3600 } })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const weather = await response.json()
  return weather
}
