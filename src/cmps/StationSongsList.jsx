import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import { Svgs } from "./Svgs";

export function StationSongsList({ songs, onRemoveSong, onToggleLikedSong }) {
   const [hoveredIndex, setHoveredIndex] = useState(null)
   const user = userService.getLoggedinUser()

   function isLiked(songId) {
      return user?.likedSongIds?.includes(songId)
   }

   function handleDropdownClick() {
      console.log('Dropdown clicked')
   }

   function handleAddRemoveClick() {
      console.log('Hi')
   }

   function getRelativeTime(dateStr) {
      const date = new Date(dateStr)
      const diff = Date.now() - date.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const years = Math.floor(days / 365)

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
      if (days > 30) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      return `just now`
   }

   return (
      <section className="songs-list grid">
         <div className="songs-list-header grid">
            <div className="song-list-number">#</div>
            <div className="song-list-title">Title</div>
            <div className="song-list-album">Album</div>
            <div className="song-list-date">Date Added</div>
            <div className="song-list-duration">{Svgs.durationIcon}</div>
            <div className="song-list-display">
               <button className="dropdown-btn" onClick={handleDropdownClick}></button>
            </div>
         </div>

         {songs.map((song, index) => (
            <div className="songs-list-row grid" key={song.id || index}
               onMouseEnter={() => setHoveredIndex(index)}
               onMouseLeave={() => setHoveredIndex(null)}
            >
               <div className="song-list-number" onClick={handleAddRemoveClick}>
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
                  {isLiked(song.id) ? (<button className="btn-song-toggle-liked check-positive" onClick={() => onToggleLikedSong(song)}>{Svgs.checkIcon}</button>)
                     : ((<button className="btn-song-toggle-liked" onClick={() => onToggleLikedSong(song)}>{Svgs.addIcon}</button>))}
                  <button className="btn-song-remove" onClick={() => onRemoveSong(song.id)}>{Svgs.threeDotsIcon}</button>
               </div>
            </div>
         ))}
      </section>
   )



}