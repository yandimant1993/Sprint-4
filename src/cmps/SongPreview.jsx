import { Svgs } from './Svgs'
import { truncateWords } from '../services/util.service'

export function SongPreview({ currentSong, isPlaying }) {

    // const currentSong = {
    //     title: "כנפיים | טונה מארח את מרגול",
    //     artist: "Tuna",
    //     image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    // }
    
console.log('currentSong: ',currentSong)
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