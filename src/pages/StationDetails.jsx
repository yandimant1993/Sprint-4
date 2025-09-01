import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ColorThief from 'colorthief'

import { loadStation, removeStation, updateStation } from '../store/actions/station.actions'

import { DetailsHeader } from '../cmps/DetailsHeader'
import { DetailsMain } from '../cmps/DetailsMain'
import { SearchDetailsSongs } from '../cmps/SearchDetailsSongs'
import { Svgs } from '../cmps/Svgs'

export function StationDetails({ onSelectVideo }) {
  const navigate = useNavigate()
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)

  const [bgColor, setBgColor] = useState([40, 40, 40])
  const [songs, setSongs] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    loadStation(stationId)
    console.log('StaionDetails rendered updated')
  }, [stationId])

  useEffect(() => {
    if (station?.songs) setSongs(station.songs)
    if (!station?.stationImgUrl) return
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = station.stationImgUrl
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const color = colorThief.getColor(img)
        setBgColor(color)
      } catch (err) {
        console.warn("Color extraction failed:", err)
      }
    }
  }, [station?.stationImgUrl, station?.songs])

  async function onDeleteStation() {
    if (!station?._id) return
    try {
      await removeStation(station._id, station.type)
      navigate('/')
    } catch (err) {
      console.error('Failed to delete station:', err)
    }
  }

  // async function onRemoveSong(songId) {
  //   try {
  //     const updatedStation = await stationService.removeSong(songId, station._id)
  //     setSongs(updatedStation.songs)
  //   } catch (error) {
  //     console.error('Failed to delete song!', error)
  //   }
  // }

  // function onAddSong(song) {
  //   const updatedStation = { ...station, songs: [...station.songs, song] }
  //   updateStation(updatedStation)
  // }

  if (!station) return null

  const bgStyle = {
    background: `linear-gradient(
      to bottom,
      rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.3),
      rgba(0, 0, 0, 0.75)
    )`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <section className="station-details" style={bgStyle}>
      <DetailsHeader
        station={station}
        dominantColor={bgColor}
        Svgs={Svgs}
        onSave={updateStation}
      />

      <DetailsMain
        station={station}
        songs={songs}
        onDeleteStation={onDeleteStation}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        dominantColor={bgColor}
      />

      <SearchDetailsSongs onSelectVideo={onSelectVideo} stationId={stationId} />
    </section>
  )
}
