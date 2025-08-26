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
      <table className="songs-table">
         <thead>
            <tr className="songlist-table-header">
               <th>#</th>
               <th>Title</th>
               <th>Album</th>
               <th>Date Added</th>
               <th>Duration</th>
               <th>
                  <button className="dropdown-btn" onClick={() => handleDropdownClick()}>
                  </button>
               </th>
            </tr>
         </thead>
         <tbody>
            {songs.map((song, index) => (
               <tr key={song.id || index}>
                  <td>
                     {index + 1}
                  </td>
                  <td className="flex"><img src={song.imgUrl} alt={song.title} width="40" height="40" />{song.title}</td>
                  <td>{song.album}</td>
                  <td>{new Date(song.dateAdded).toLocaleDateString()}</td>
                  <td>{song.duration || '--:--'}</td>
                  <td>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )

   function handleDropdownClick() {
      console.log('Dropdown clicked')
   }
}