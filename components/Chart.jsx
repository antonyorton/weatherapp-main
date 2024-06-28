'use client'

import 'chartjs-adapter-date-fns'
// import zoomPlugin, { zoom } from 'chartjs-plugin-zoom'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js'
import { Line } from 'react-chartjs-2'
ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CategoryScale) // zoomPlugin)

ChartJS.register({
  id: 'chartAreaBorder',
  afterDraw: (chart, args, options) => {
    const ctx = chart.ctx
    const {
      chartArea: { left, top, right, bottom }
    } = chart
    ctx.save()
    ctx.strokeStyle = options.borderColor || 'black'
    ctx.lineWidth = options.borderWidth || 1
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(right, top)
    ctx.lineTo(right, bottom)
    ctx.lineTo(left, bottom)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }
})

//create a line chart with date on the x-axis and temperature on the y-axis
//use the data from the forecast_Newcastle.js file
//this will eventually be a reusable component

export default function Chart({ data, weatherVariable, className, num_days = 5 }) {
  //prepare data for a chart
  // console.log('Component Chart.jsx  data: ', data)

  //remove any null items in data
  data = data.filter(item => item !== null)
  //convert the datetime to a date object
  data = data.map(item => {
    item.datetime = new Date(item.datetime)
    return item
  })
  //use only the most recent [num_days] days of data
  data = data.filter(item => item.datetime > new Date() - num_days * 24 * 60 * 60 * 1000)

  const weatherVariableMap = {
    temp_c: item => item.temp_c + 0,
    pressure_mb: item => item.pressure_mb + 0,
    humidity: item => item.humidity + 0
  }

  const yAxisVariableMap = {
    temp_c: 'Temperature (°C)',
    pressure_mb: 'Pressure (mb)',
    humidity: 'Humidity (%)'
  }

  const chartData = {
    labels: data.map(item => new Date(item.datetime)),
    datasets: [
      {
        label: yAxisVariableMap[weatherVariable],
        data: data.map(item => {
          return weatherVariableMap[weatherVariable](item)
        }),
        fill: false,
        pointRadius: 1.5,
        borderWidth: 1,
        backgroundColor: 'rgb(55, 55, 55)', // change to dark grey color
        borderColor: 'rgb(55, 55, 55)', // change to dark grey color
        tension: 0.5
      }
    ]
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: 'xy'
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true
      //     },
      //     mode: 'xy'
      //   }
      // },
      chartAreaBorder: {
        borderColor: 'black',
        borderWidth: 0.3
      }
    },
    scales: {
      x: {
        type: 'time',
        ticks: {
          font: {
            size: 12,
            color: 'red'
          }
        },
        time: {
          unit: 'day'
        },
        title: {
          display: false,
          text: 'Date'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.3)'
        }
      },
      y: {
        title: {
          display: true,
          text: yAxisVariableMap[weatherVariable],
          font: {
            size: 12
          }
        },
        //if weather variable is temperature, set the y-axis to begin at 0 and end at 40
        min: weatherVariable === 'temp_c' ? 0 : undefined,
        max: weatherVariable === 'temp_c' ? 45 : undefined,

        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.3)'
        },
        beginAtZero: false
      }
    }
  }

  // console.log('component Chart.jsx chart render')

  return (
    <div className=" my-2 p-1 min-w-[210px] border-2 border-green-600 rounded-lg shadow-md justify-center">
      <Line data={chartData} options={options} />
    </div>
  )
}
