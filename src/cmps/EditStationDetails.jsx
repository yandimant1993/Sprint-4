import { useState, useEffect } from 'react'

export function EditStationDetails({ station,
    svgs,
    onClose,
    onSave,
    editedName,
    setEditedName,
    description,
    setDescription
}) {
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        setEditedName(station.name || '')
        setDescription(station.description || '')
    }, [station._id])

    return (
        <div className="modal-overlay flex" onClick={onClose}>
            <div className="modal-container" onClick={ev => ev.stopPropagation()}>
                <header className="modal-header flex">
                    <h2>Edit Details</h2>
                    <button onClick={onClose}>X</button>
                </header>

                <main className="modal-main">
                    <div className="btn-station-img-container grid">
                        <div
                            className="btn-station-img"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered ? (
                                <>
                                    {svgs.editIcon}
                                    <span className="hover-text">Choose Photo! WIP</span>
                                </>
                            ) : (
                                svgs.stationNewImg
                            )}
                        </div>
                    </div>
                    <input
                        type="text"
                        className="station-name"
                        placeholder={station.name}
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                    />
                    <textarea
                        className="station-description"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button onClick={onSave} className="btn-save-station">Save</button>
                    <p className="modal-disclaimer">By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</p>
                </main>
            </div>
        </div>
    )
}