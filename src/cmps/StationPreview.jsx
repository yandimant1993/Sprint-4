import { useSelector } from "react-redux"
import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying, setCurrentSong } from "../store/actions/player.actions"

export function StationPreview({ station }) {
    // const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)
    const currentStationId = useSelector(state => state.playerModule.currentStationId)

    function handlePlayPause(station) {
        const currentSong = station.songs[0]
        setCurrentStation(station)
        setCurrentSong(currentSong)
        setIsPlaying(!isPlaying)
    }

    function truncateWords(text, limit) {
        if (!text) return ""
        const words = text.split(" ")
        if (words.length <= limit) return text
        return words.slice(0, limit).join(" ") + "..."
    }

    const isThisStationPlaying = currentStationId === station._id && isPlaying
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
                    handlePlayPause(station)
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