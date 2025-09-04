import { useDispatch } from "react-redux";
// import { addSong } from "../store/actions/player.actions";
import { stationService } from "../services/station";
// import { userService } from "../services/user";

export function SearchStationResult({ addSong , videos = [], onVideoClick,stationId  }) {
  const dispatch = useDispatch();
  const safeVideos = Array.isArray(videos) ? videos : [];



  function shortenTitle(title, maxLength = 60) {
  if (title.length <= maxLength) return title;

  const words = title.split(' ');
  let shortTitle = '';

  for (let word of words) {
    if ((shortTitle + ' ' + word).trim().length > maxLength) break;
    shortTitle += (shortTitle ? ' ' : '') + word;
  }


  return shortTitle;
}

  return (
    <section className="songs-list-res grid">
      {safeVideos.map((video, index) => (
        <div
          key={video.id || index}
          className="songs-list-row-res grid video-item"
          onClick={() => onVideoClick(video)}
        >
          <div className="song-list-snippet-res grid">
            <img
              src={video.imgUrl}
              alt={video.title}
              className="song-img-res"
              width="40"
              height="40"
            />
            <div className="song-info-text-res grid">
              <span className="song-title-res ellipses">{shortenTitle(video.title)}</span>
              {video.artist && <span className="song-artist-res ellipses">{video.artist}</span>}
            </div>
          </div>
          <div className="song-list-album-res">{video.album || "--"}</div>
          <div className="btn-add-song-res flex">
            <button
  className="btn-song-add"
  onClick={(e) => {
    e.stopPropagation();
   addSong(video)
  }}
>
  Add
</button>
          </div>
        </div>
      ))}
    </section>
  );
}

 




// export function SearchStationResult({ videos, onVideoClick }) {
//     return (
//         <>

//             {videos.length > 0 && (
//                 <div className="search-results-station grid">
//                     {videos.map(video => (
                 
//                         <div key={video.id} className="video-item songs-list-result-row grid" onClick={() => onVideoClick(video)}>
//                             <img src={video.thumbnail} alt={video.title} width="40" height="40" className="song-img" />
//                             <p className="song-list-title">{video.title}</p>
//                         </div>

//                     ))}
//                 </div>
//             )}

//         </>
//     )
// }
