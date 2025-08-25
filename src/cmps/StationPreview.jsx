import { Svgs } from "./Svgs"

export function StationPreview({ station }) {
    return (

        <article className="station-preview">
            <div className="svg-play">
                {Svgs.play}
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