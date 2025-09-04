import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying, setCurrentSong } from "../store/actions/player.actions"
import { useSelector } from "react-redux"

export function StationPreview({ station }) {

    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)

    function handlePlayPause() {
        setCurrentStation(station)
        setCurrentSong(station.song[0])
        setIsPlaying(!isPlaying)
        console.log('station, station.song[0], isPlaying: ', station, station.song[0], isPlaying)
    }

function truncateWords(text, limit) {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    let truncated = words.slice(0, limit).join(" ");
    const lastWord = words[limit - 1];
    const maxLastWordLength = 5; 
    if (lastWord.length > maxLastWordLength) {
        truncated = words.slice(0, limit - 1).join(" ") + "...";
    } else {
        truncated += "...";
    }
    return truncated;
}


    const isThisStationPlaying = currentStation?._id === station._id && isPlaying

    return (
        <article className="station-preview">
            {station.stationImgUrl &&
                <img
                    src={station.stationImgUrl}
                    alt={station.name}
                    className="station-picture"
                />
            }

            <div
                className="svg-play"
                onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    handlePlayPause()
                }}
            >
                {isThisStationPlaying ? Svgs.pause : Svgs.play}
            </div>

            {station.songs &&
                <p className="station-description">
                    {truncateWords(station.description, 5)}
                </p>
            }
        </article>
    )
}