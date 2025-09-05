import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ColorThief from 'colorthief'

import { addStationSong, loadStation, removeStation, removeStationSong, updateStation } from '../store/actions/station.actions'

import { DetailsHeader } from '../cmps/DetailsHeader'
import { DetailsMain } from '../cmps/DetailsMain'
import { SearchDetailsSongs } from '../cmps/SearchDetailsSongs'
import { Svgs } from '../cmps/Svgs'

export function StationDetails({ onSelectVideo }) {
  const navigate = useNavigate()
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)

  const [bgColor, setBgColor] = useState([40, 40, 40])
  // const [songs, setSongs] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])

  // useEffect(() => {
  //   if (station?.songs) setSongs(station.songs)
  // }, [station?.songs])

  useEffect(() => {
    // if (station?.songs) setSongs(station.songs)
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
  }, [station?.stationImgUrl])

  async function onDeleteStation() {
    if (!station?._id) return
    try {
      await removeStation(station._id, station.type)
      navigate('/')
    } catch (err) {
      console.error('Failed to delete station:', err)
    }
  }

  async function onAddStationSong(song) {
    try {
      const savedSong = await addStationSong(stationId, song)
      console.log('savedSong', savedSong)
    } catch (err) {
      console.log('Cannot save song', err)
    }
  }

  async function onRemoveStationSong(songId) {
    try {
      const removedSongId = await removeStationSong(stationId, songId)
      console.log('removedSongId', removedSongId)
    } catch (err) {
      console.log('Cannot save song', err)
    }
  }

  if (!station) return null

  const bgStyle = {
    backgroundImage: `linear-gradient(
    to bottom,
    rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.3),
    rgba(0, 0, 0, 0.75)
  )`,
    backgroundRepeat: 'no-repeat',
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
        // songs={songs}
        removeSong={onRemoveStationSong}
        onDeleteStation={onDeleteStation}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        dominantColor={bgColor}
      />

      <SearchDetailsSongs addSong={onAddStationSong} onSelectVideo={onSelectVideo} stationId={stationId} />
    </section>
  )
}
