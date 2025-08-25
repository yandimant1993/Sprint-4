

export function StationPreview({ station }) {
    return (
        <article className="station-preview">
            {station.stationImgUrl &&
                <img
                    src={station.stationImgUrl}
                    alt={station.name}
                    className="station-picture" />
            }
            {station.songs &&
                <p className="singer">{station.songs[0].performer}</p>}
        </article>
    )
}