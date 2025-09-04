import { Svgs } from './Svgs'
import { truncateWords } from '../services/util.service'

export function SongPreview({ currentSong, isPlaying }) {
    
    return (
        currentSong && (
            <div className="current-song-container grid">
                <div className="current-song-image">
                    <img
                        src={currentSong.imgUrl}
                        alt={currentSong.title}
                        onError={(e) => {
                            e.target.src = '/src/assets/img/sunflowers.jpg'
                        }}
                    />
                </div>
                <div className="current-song-info grid">
                    <span className="current-song-title">{truncateWords(currentSong.title, 6)}</span>
                    <span className="current-song-artist">{truncateWords(currentSong.artist, 4)}</span>
                </div>
                <div className="btn-add-current-song grid">
                    {Svgs.addIcon}
                </div>
            </div>
        )
    )
}