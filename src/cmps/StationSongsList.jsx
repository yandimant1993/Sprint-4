import { useSelector, useDispatch } from 'react-redux'
import { removeSong, setCurrentSong } from '../store/actions/player.actions';
import { useState } from "react"
import { Svgs } from "./Svgs"
import { userService } from '../services/user'


export function StationSongsList({ onToggleLikedSong, onSelectSong,songs }) {
   const [hoveredIndex, setHoveredIndex] = useState(null)
   // const songs = useSelector(state => state.playerModule.songs || [])
   const dispatch = useDispatch()
   const user = userService.getLoggedinUser()

   function isLiked(songId) {
      return user?.likedSongs?.some(likedSong => likedSong.id === songId)
   }


   function handleRemove(songId) {
      dispatch(removeSong(songId))
   }


   function handleSongClick(song) {
      if (onSelectSong) onSelectSong(song.youtubeVideoId)
      dispatch(setCurrentSong(song))
   }

   function getRelativeTime(dateStr) {
      const date = new Date(dateStr)
      const diff = Date.now() - date.getTime()
      const minutes = Math.floor(diff / 1000 / 60)
      if (minutes < 1) return 'just now'
      if (minutes < 60) return `${minutes} min ago`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours} hours ago`
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} ago`
   }
   
   console.log('songs:',songs)
   return (
      <section className="songs-list grid">
         <div className="songs-list-header grid">
            <div className="song-list-number">#</div>
            <div className="song-list-title">Title</div>
            <div className="song-list-album">Album</div>
            <div className="song-list-date">Date Added</div>
            <div className="song-list-duration">{Svgs.durationIcon}</div>
         </div>
         {songs.map((song, index) => (
            <div
               className="songs-list-row grid"
               key={song.id || index}
               onMouseEnter={() => setHoveredIndex(index)}
               onMouseLeave={() => setHoveredIndex(null)}
               onClick={() => handleSongClick(song)}
            >
               <div className="song-list-number">
                  {hoveredIndex === index ? Svgs.play : index + 1}
               </div>
               <div className="song-list-title flex">
                  <img src={song.imgUrl} alt={song.title} width="40" height="40" className="song-img" />
                  <div className="song-info-text grid">
                     <span className="song-title">{song.title}</span>
                     <span className="song-artist">{song.artist}</span>
                  </div>
               </div>
               <div className="song-list-album">{song.album}</div>
               <div className="song-list-date">{getRelativeTime(song.dateAdded)}</div>
               <div className="song-list-duration">{song.duration || '--:--'}</div>
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
         ))}
      </section>
   );
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