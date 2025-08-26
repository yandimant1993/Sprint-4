import { useState } from 'react'

import { updateStation } from '../store/actions/station.actions'
import { Svgs } from './Svgs.jsx'
import { EditStationDetails } from './EditStationDetails.jsx'
import { userService } from '../services/user'

export function DetailsHeader({ station }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedName, setEditedName] = useState(station.name)
    const [description, setDescription] = useState('')

    async function handleSave(ev) {
        ev?.preventDefault?.()
        try {
            const updatedStation = { ...station, name: editedName, description: description, }
            await updateStation(updatedStation)
            setIsModalOpen(false)
        } catch (err) {
            console.error('Failed to update station:', err)
        }
    }

    return (
        <section className="details-header-container flex">
            <div className="btn-station-img-container grid">
                <div
                    className="btn-station-img"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
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
                <div className="station-name" onClick={() => setIsModalOpen(true)}>{station.name}</div>
                <div className="station-creator">{station.createdBy?.fullname || 'Guest'}</div>
            </div>

            {isModalOpen && (
                <EditStationDetails
                    station={station}
                    svgs={Svgs}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    editedName={editedName}
                    setEditedName={setEditedName}
                    description={description}
                    setDescription={setDescription}
                />
            )}
        </section>
    )
}