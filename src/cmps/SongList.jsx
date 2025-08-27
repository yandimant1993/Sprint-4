// export function SongList({ songs }) {
export function SongList() {

   const songs = [
      {
         id: 's001',
         title: 'Sunset Drive',
         album: 'Lofi Nights',
         dateAdded: '2025-08-01T12:30:00Z',
         duration: '3:24',
         imgUrl: 'https://placehold.co/40x40'
      },
      {
         id: 's002',
         title: 'Rainy Nights',
         album: 'Quiet Storm',
         dateAdded: '2025-08-05T09:15:00Z',
         duration: '4:12',
         imgUrl: 'https://placehold.co/40x40'
      },
      {
         id: 's003',
         title: 'Electric Feel',
         album: 'Indie Classics',
         dateAdded: '2025-08-10T14:05:00Z',
         duration: '3:49',
         imgUrl: 'https://placehold.co/40x40'
      },
      {
         id: 's004',
         title: 'Youth',
         album: 'Acoustic Moods',
         dateAdded: '2025-08-15T18:22:00Z',
         duration: '4:01',
         imgUrl: 'https://placehold.co/40x40'
      },
      {
         id: 's005',
         title: 'Nightcall',
         album: 'Synthwave Drive',
         dateAdded: '2025-08-20T11:00:00Z',
         duration: '5:05',
         imgUrl: 'https://placehold.co/40x40'
      }
   ]

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