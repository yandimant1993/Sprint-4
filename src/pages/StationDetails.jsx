import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ColorThief from 'colorthief'

import { loadStation } from '../store/actions/station.actions'
import { DetailsHeader } from '../cmps/DetailsHeader'
import { DetailsMain } from '../cmps/DetailsMain'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)
  const [bgColor, setBgColor] = useState([0, 0, 0]) 

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])


  useEffect(() => {
    if (!station?.imgUrl) return
    const img = new Image()
    img.crossOrigin = "anonymous" 
    img.src = station.imgUrl
    img.onload = () => {
      const colorThief = new ColorThief()
      const color = colorThief.getColor(img)
      setBgColor(color)
    }
  }, [station?.imgUrl])

  if (!station) return null

  const bgStyle = {
    background: `linear-gradient(to bottom, rgba(141, 128, 128, 0.27), rgba(0, 0, 0, 0.75)), rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <section className="station-details" style={bgStyle}>
      <DetailsHeader station={station} />
      <DetailsMain station={station} />
    </section>
  )
}







// import { useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// import { loadStation, addStationMsg } from '../store/actions/station.actions'
// import { SongList } from '../cmps/SongList'
// import { DetailsHeader } from '../cmps/DetailsHeader'
// import { DetailsMain } from '../cmps/DetailsMain'

// export function StationDetails() {
//   const { stationId } = useParams()
//   const station = useSelector(storeState => storeState.stationModule.station)

//   useEffect(() => {
//     loadStation(stationId)
//   }, [stationId])

//   if (!station) return
//   return (
//     <section className="station-details">
//       <DetailsHeader station={station} />
//       <DetailsMain station={station} />
//     </section>
//   )
// }