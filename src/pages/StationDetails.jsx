// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import ColorThief from 'colorthief'

// import { loadStation } from '../store/actions/station.actions'
// import { DetailsHeader } from '../cmps/DetailsHeader'
// import { DetailsMain } from '../cmps/DetailsMain'
// import { SearchStationResult } from '../cmps/SearchStationResult'
// import { SearchDetailsSongs } from '../cmps/SearchDetailsSongs'

// export function StationDetails(onSelectVideo, videos, handleVideoClick) {
//   const { stationId } = useParams()
//   const station = useSelector(storeState => storeState.stationModule.station)
//   const [bgColor, setBgColor] = useState([0, 0, 0])

//   useEffect(() => {
//     loadStation(stationId)
//   }, [stationId])

//   useEffect(() => {
//     if (!station?.imgUrl) return
//     const img = new Image()
//     img.crossOrigin = "anonymous"
//     img.src = station.imgUrl
//     img.onload = () => {
//       const colorThief = new ColorThief()
//       const color = colorThief.getColor(img)
//       setBgColor(color)
//     }
//   }, [station?.imgUrl])

//   if (!station) return null

//   const bgStyle = {
//     background: `linear-gradient(to bottom, rgba(141, 128, 128, 0.27), rgba(0, 0, 0, 0.75)), rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//   }

//   return (
//     <section className="station-details" style={bgStyle}>
//       <DetailsHeader station={station} />
//       <DetailsMain station={station} /><br />

//       <h1>Let's find something for your playlist</h1>
//       <SearchDetailsSongs onSelectVideo={onSelectVideo} />
//       <SearchStationResult
//         videos={videos}
//         onVideoClick={handleVideoClick}
//       />
//     </section>
//   )
// }







// // import { useEffect } from 'react'
// // import { useParams } from 'react-router-dom'
// // import { useSelector } from 'react-redux'

// // import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// // import { loadStation, addStationMsg } from '../store/actions/station.actions'
// // import { SongList } from '../cmps/SongList'
// // import { DetailsHeader } from '../cmps/DetailsHeader'
// // import { DetailsMain } from '../cmps/DetailsMain'

// // export function StationDetails() {
// //   const { stationId } = useParams()
// //   const station = useSelector(storeState => storeState.stationModule.station)

// //   useEffect(() => {
// //     loadStation(stationId)
// //   }, [stationId])

// //   if (!station) return
// //   return (
// //     <section className="station-details">
// //       <DetailsHeader station={station} />
// //       <DetailsMain station={station} />
// //     </section>
// //   )
// // }

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ColorThief from 'colorthief'

import { loadStation, removeStation, updateStation } from '../store/actions/station.actions'
import { setCurrentStation, setIsPlaying } from '../store/actions/player.actions'
import { stationService } from '../services/station/station.service.local'
import { userService } from '../services/user'

import { DetailsHeader } from '../cmps/DetailsHeader'
import { DetailsMain } from '../cmps/DetailsMain'
import { SearchStationResult } from '../cmps/SearchStationResult'
import { SearchDetailsSongs } from '../cmps/SearchDetailsSongs'
import { Svgs } from '../cmps/Svgs'
import { UPDATE_STATION } from '../store/reducers/station.reducer'

export function StationDetails({ onSelectVideo, videos, handleVideoClick }) {
  const { stationId } = useParams()
  const navigate = useNavigate()
  const station = useSelector(storeState => storeState.stationModule.station)
  const currentStation = useSelector(state => state.playerModule.currentStation)
  const isPlaying = useSelector(state => state.playerModule.isPlaying)

  const [bgColor, setBgColor] = useState([40, 40, 40])
  const [songs, setSongs] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    loadStation(stationId)
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

  const handlePlayPause = () => {
    if (currentStation?._id === station._id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentStation(station)
      setIsPlaying(true)
    }
  }

  async function onDeleteStation() {
    if (!station?._id) return
    try {
      await removeStation(station._id, station.type)
      navigate('/')
    } catch (err) {
      console.error('Failed to delete station:', err)
    }
  }

  async function onRemoveSong(songId) {
    try {
      const updatedStation = await stationService.removeSong(songId, station._id)
      setSongs(updatedStation.songs)
    } catch (error) {
      console.error('Failed to delete song!', error)
    }
  }

  async function onToggleLikedSong(song) {
    console.log('song: ', song)
    try {
      const updatedStation = await userService.toggleLikedSongs(song)
      dispatch({ type: UPDATE_STATION, station: updatedStation })
    } catch (err) {
      console.error('Failed to toggle liked song:', err)
    }
  }

  function onAddSong(song) {
    const updatedStation = { ...station, songs: [...station.songs, song] }
    updateStation(updatedStation)
  }

  if (!station) return null

  const bgStyle = {
    background: `linear-gradient(to bottom, rgba(141, 128, 128, 0.27), rgba(0, 0, 0, 0.75)), rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
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
        onPlayPause={handlePlayPause}
        isPlaying={currentStation?._id === station._id && isPlaying}
        onRemoveSong={onRemoveSong}
        onToggleLikedSong={onToggleLikedSong}
        onDeleteStation={onDeleteStation}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        Svgs={Svgs}
        dominantColor={bgColor}
      />

      <br />
      <h1>Let's find something for your playlist</h1>
      <SearchDetailsSongs onSelectVideo={onSelectVideo} />
      <SearchStationResult videos={videos} onVideoClick={handleVideoClick} />
    </section>
  )
}
