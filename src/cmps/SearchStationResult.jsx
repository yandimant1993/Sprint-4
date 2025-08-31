import { useDispatch } from "react-redux";
// import { addSong } from "../store/actions/player.actions";
import { stationService } from "../services/station";
// import { userService } from "../services/user";

export function SearchStationResult({ videos = [], onVideoClick,stationId  }) {
  const dispatch = useDispatch();
  const safeVideos = Array.isArray(videos) ? videos : [];

  return (
    <section className="songs-list grid">
      {safeVideos.map((video, index) => (
        <div
          key={video.id || index}
          className="songs-list-row grid video-item"
          onClick={() => onVideoClick(video)}
        >
          <div className="song-list-number-res">{index + 1}</div>

          <div className="song-list-title-res flex">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="song-img"
              width="40"
              height="40"
            />
            <div className="song-info-text-res grid">
              <span className="song-title">{video.title}</span>
              {video.artist && <span className="song-artist">{video.artist}</span>}
            </div>
          </div>

          <div className="song-list-album-res">{video.album || "--"}</div>
          <div className="song-list-duration-res">{video.duration || "--:--"}</div>

          <div className="hover-btns-actions-res flex">
            <button
  className="btn-song-add"
  onClick={(e) => {
    e.stopPropagation();
   stationService.addSong(video,stationId)
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
