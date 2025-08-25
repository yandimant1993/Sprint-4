import { useState } from 'react'
import { Svgs } from './Svgs.jsx'

export function DetailsHeader({ station }) {
    const { name, createdBy } = station
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section className="details-header-container flex">
            <div className="btn-station-img-container grid">
            <div className="btn-station-img"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                {isHovered ? (
                    <>
                        {Svgs.editIcon}
                        <span className="hover-text">Choose Photo! WIP</span>
                    </>
                ) : (
                    Svgs.stationNewImg
                )}
            </div>
                </div>
            <div className="details-header-text">
                <span className="station-type">Public Playlist</span>
                <h1 className="station-name">{name}</h1>
                <div className="station-creator">{createdBy?.fullname || 'Guest'}</div>
            </div>
        </section>
    )
}