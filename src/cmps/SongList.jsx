export function SongList({songs, onRemoveSong}) {

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
               <button className="song-remove" onClick={onRemoveSong}>Delete Song</button>
            </div>
         ))}
      </section>
   )

   function handleDropdownClick() {
      console.log('Dropdown clicked')
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

}