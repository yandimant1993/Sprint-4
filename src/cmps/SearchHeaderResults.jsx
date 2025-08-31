import { useDispatch } from "react-redux";
// import { addSong } from "../store/actions/player.actions";
// import { stationService } from "../services/station";
// import { userService } from "../services/user";

export function SearchHeaderResults({ videos = [], onVideoClick }) {
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
                                //    stationService.addSong(video)
                                console.log('click add song:')
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

