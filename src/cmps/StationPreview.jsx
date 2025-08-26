import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying } from "../store/actions/player.actions"
import { useSelector } from "react-redux"

export function StationPreview({ station }) {

    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)

    const handlePlayPause = () => {
        if (currentStation?._id === station._id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentStation(station)
            setIsPlaying(true)
        }
    }

    const isThisStationPlaying = currentStation?._id === station._id && isPlaying

    return (

        <article className="station-preview" onClick={handlePlayPause}>
            <div className="svg-play">
                {isThisStationPlaying ? Svgs.pause : Svgs.play}
            </div>
            {station.stationImgUrl &&
                <img
                    src={station.stationImgUrl}
                    alt={station.name}
                    className="station-picture" />
            }

            {station.songs &&
                <p className="name">{station.name}</p>}

        </article>
    )
}