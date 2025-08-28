import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying } from "../store/actions/player.actions"
import { useDispatch, useSelector } from "react-redux"

export function StationPreview({ station }) {

    const dispatch = useDispatch()
    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)


    const handlePlayPause = (ev) => {
        if (currentStation?._id === station._id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentStation(station)
            setIsPlaying(true)
        }
    }

    function truncateWords(text, limit) {
        if (!text) return ""
        const words = text.split(" ")
        if (words.length <= limit) return text
        return words.slice(0, limit).join(" ") + "..."
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