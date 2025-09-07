import { Svgs } from './Svgs'
import { truncateWords } from '../services/util.service'

export function SongPreview({ currentSong, isPlaying }) {

    const song = currentSong || {
        id: "CC5ca6Hsb2Q",
        title: "Robert Miles - Children [Dream Version]",
        artist: "Robert Miles",
        imgUrl: "https://i.ytimg.com/vi/CC5ca6Hsb2Q/mqdefault.jpg"
    }

    console.log('song: ', song)
    // if (!currentSong) return <h3>Loading song</h3>
    return (
        // currentSong && (
        <div className="current-song-container grid">
            <div className="current-song-image">
                <img
                    src={song.imgUrl || "https://i.ytimg.com/vi/CC5ca6Hsb2Q/mqdefault.jpg"}
                    alt={song.title}
                    onError={(e) => {
                        e.target.src = '/src/assets/img/sunflowers.jpg'
                    }}
                />
            </div>
            <div className="current-song-info grid">
                <span className="current-song-title">{truncateWords(song.title || "Robert Miles - Children [Dream Version]", 4)}</span>
                <span className="current-song-artist">{truncateWords(song.artist || "Robert Miles", 4)}</span>
            </div>
            <div className="btn-add-current-song grid">
                {Svgs.addIcon}
            </div>
        </div>
        // )
    )
}