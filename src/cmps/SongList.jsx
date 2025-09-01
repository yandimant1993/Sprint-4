import { getRelativeTime } from "../services/util.service";
import { IoAddCircle } from "react-icons/io5";

export function SongList({ songs, onRemoveSong,onAddSong }) {

   return (
      <section className="songs-list grid">
         <div className="songs-list-header grid">
            <div className="song-list-number">#</div>
            <div className="song-list-title">Title</div>
            <div className="song-list-album">Album</div>
            <div className="song-list-date">Date Added</div>
            <div className="song-list-duration">Duration</div>
            <div className="song-list-display">
               <button className="dropdown-btn" onClick={handleDropdownClick}></button>
            </div>
         </div>

         {songs.map((song, index) => (
            <div className="songs-list-row grid" key={song.id || index}>
               <div className="song-list-number">{index + 1}</div>
               <div className="song-list-title flex">
                  <img src={song.imgUrl} alt={song.title} width="40" height="40" />
                  {song.title}
               </div>
               <div className="song-list-album">{song.album}</div>
               <div className="song-list-date">{getRelativeTime(song.dateAdded)}</div>
               <div className="song-list-duration">{song.duration || '--:--'}</div>
               <div className="song-list-display"></div>
               <button className="song-add" onClick={() => onAddSong(song)}>Add</button>
               <button className="song-remove" onClick={() => onRemoveSong(song.id)}>Delete Song</button>
            </div>
         ))}
      </section>
   )

   function handleDropdownClick() {
      console.log('Dropdown clicked')
   }

}