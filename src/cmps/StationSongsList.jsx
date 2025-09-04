import { useSelector } from 'react-redux'
import { useState } from "react"
import { setCurrentSong, setIsPlaying } from '../store/actions/player.actions'
import { truncateWords, getRelativeTime } from '../services/util.service'
import { userService } from '../services/user'
import { stationService } from '../services/station'
import { Svgs } from "./Svgs"
import { EqualizerBars } from './utilCmps/EqualizerBars'

export function StationSongsList({ onToggleLikedSong, station, removeSong }) {
   const currentStation = useSelector(state => state.playerModule.currentStation)
   const currentSong = useSelector(state => state.playerModule.currentSong)
   const isPlaying = useSelector(state => state.playerModule.isPlaying)

   const [hoveredIndex, setHoveredIndex] = useState(null)

   const user = userService.getLoggedinUser()
   const songs = station.songs

   function isLiked(songId) {
      return user?.likedSongId?.includes(songId)
   }

   function handleRemove(songId) {
      removeSong(songId)
   }

   // async function handleSongClick(station, song) {
   //    await stationService.getSongFromStation(station._id, song.id)
   //    const index = station.songs.findIndex(s => s.id === song.id)
   //    setCurrentSong(song, station.songs, index)
   //    setIsPlaying(!isPlaying)
   // }

   async function handlePlayPause(song) {
      setCurrentSong(song)
      setIsPlaying()

   }

   // const isActiveSong = currentSong?.id === song.id;
   const isCurrentStation = currentStation?._id === station._id;

   return (
      <section className="songs-list grid">
         <div className="songs-list-header grid">
            <div className="song-list-number">#</div>
            <div className="song-list-title">Title</div>
            <div className="song-list-album">Album</div>
            <div className="song-list-date ellipses">Date Added</div>
            <div className="song-list-duration">{Svgs.durationIcon}</div>
         </div>

         {songs?.map((song, index) => {
            const isActive = currentSong?.id === song.id
            return (
               <div
                  className={`songs-list-row grid ${isActive ? 'active' : ''}`}
                  key={song.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handlePlayPause(song)}
               >
                  <div className="station-song-list-number">
                     {isActive && isCurrentStation && isPlaying
                        ? <EqualizerBars width={16} height={16} fill="var(--clr-lightgreen)" />
                        : hoveredIndex === index
                           ? Svgs.play
                           : index + 1}
                  </div>

                  <div className="station-song-list-title flex">
                     <img src={song.imgUrl} alt={song.title} width="40" height="40" className="song-img" />
                     <div className="station-song-info-text grid">
                        <span className="station-song-title ellipses">{truncateWords(song.title, 10)}</span>
                        <span className="station-song-artist ellipses">{song.artist}</span>
                     </div>
                  </div>
                  <div className="station-song-list-album">{song.album}</div>
                  <div className="station-song-list-date">{getRelativeTime(song.dateAdded)}</div>
                  <div className="station-song-list-duration">{song.duration || '--:--'}</div>

                  <div className="hover-btns-actions flex">
                     {isLiked(song.id) ? (
                        <button
                           className="btn-song-toggle-liked check-positive"
                           onClick={(e) => {
                              e.stopPropagation()
                              onToggleLikedSong(song)
                           }}
                        >
                           {Svgs.checkIcon}
                        </button>
                     ) : (
                        <button
                           className="btn-song-toggle-liked"
                           onClick={(e) => {
                              e.stopPropagation()
                              onToggleLikedSong(song)
                           }}
                        >
                           {Svgs.addIcon}
                        </button>
                     )}
                     <button
                        className="btn-song-remove"
                        onClick={(e) => {
                           e.stopPropagation()
                           handleRemove(song.id)
                        }}
                     >
                        {Svgs.threeDotsIcon}
                     </button>
                  </div>
               </div>
            )
         })}
      </section>
   )
}






// import { IoAddCircle } from "react-icons/io5";
// import { useState } from "react";
// import { Svgs } from "./Svgs";

// export function StationSongsList({ songs, onRemoveSong, onToggleLikedSong }) {
//    const [hoveredIndex, setHoveredIndex] = useState(null)
//
//    const user = userService.getLoggedinUser()

//    function isLiked(songId) {
//       return user?.likedSongs?.some(likedSong => likedSong.id === songId)
//    }

//    function handleDropdownClick() {
//       console.log('Dropdown clicked')
//    }

//    function handleAddRemoveClick() {
//       console.log('Hi')
//    }

//    function getRelativeTime(dateStr) {
//       const date = new Date(dateStr)
//       const diff = Date.now() - date.getTime()
//       const seconds = Math.floor(diff / 1000)
//       const minutes = Math.floor(seconds / 60)
//       const hours = Math.floor(minutes / 60)
//       const days = Math.floor(hours / 24)
//       const years = Math.floor(days / 365)

//       if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
//       if (days > 30) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
//       if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
//       if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
//       if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
//       return `just now`
//    }

//    return (
//       <section className="songs-list grid">
//          <div className="songs-list-header grid">
//             <div className="song-list-number">#</div>
//             <div className="song-list-title">Title</div>
//             <div className="song-list-album">Album</div>
//             <div className="song-list-date">Date Added</div>
//             <div className="song-list-duration">{Svgs.durationIcon}</div>
//             <div className="song-list-display">
//                <button className="dropdown-btn" onClick={handleDropdownClick}></button>
//             </div>
//          </div>

//          {songs.map((song, index) => (
//             <div className="songs-list-row grid" key={song.id || index}
//                onMouseEnter={() => setHoveredIndex(index)}
//                onMouseLeave={() => setHoveredIndex(null)}
//             >
//                <div className="song-list-number" onClick={handleAddRemoveClick}>
//                   {hoveredIndex === index ? Svgs.play : index + 1}
//                </div>
//                <div className="song-list-title flex">
//                   <img src={song.imgUrl} alt={song.title} width="40" height="40" className="song-img" />
//                   <div className="song-info-text grid">
//                      <span className="song-title">{song.title}</span>
//                      <span className="song-artist">{song.artist}</span>
//                   </div>
//                </div>
//                <div className="song-list-album">{song.album}</div>
//                <div className="song-list-date">{getRelativeTime(song.dateAdded)}</div>
//                <div className="song-list-duration">{song.duration || '--:--'}</div>
//                <div className="hover-btns-actions flex">
//                   {isLiked(song.id) ? (<button className="btn-song-toggle-liked check-positive" onClick={() => onToggleLikedSong(song)}>{Svgs.checkIcon}</button>)
//                      : ((<button className="btn-song-toggle-liked" onClick={() => onToggleLikedSong(song)}>{Svgs.addIcon}</button>))}
//                   <button className="btn-song-remove" onClick={() => onRemoveSong(song.id)}>{Svgs.threeDotsIcon}</button>
//                </div>
//             </div>
//          ))}
//       </section>
//    )

// }