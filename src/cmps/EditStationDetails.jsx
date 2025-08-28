import { useState, useEffect, useRef } from 'react'
import { Svgs } from './Svgs'

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
    const modalRef = useRef()

    useEffect(() => {
        setEditedName(station.name || '')
        setDescription(station.description || '')
    }, [station._id])

    useEffect(() => {
        function handleClickOutside(ev) {
            if (modalRef.current && !modalRef.current.contains(ev.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    function handleClick() {
        console.log('clicked edit image')
    }

    return (
        <div className="edit-station-modal-overlay flex" onClick={onClose}>
            <div className="edit-station-modal-container" ref={modalRef} onClick={ev => ev.stopPropagation()}>
                <header className="edit-station-modal-header flex">
                    <p className="edit-details-h">Edit Details</p>
                    <button className="btn-edit-close-modal" onClick={onClose}>{Svgs.xIcon}</button>
                </header>

                <main className="edit-station-main grid">
                    <div className="btn-edit-station-img-container grid">
                        <div
                            className="btn-edit-station-img"
                            style={{
                                backgroundImage: station.stationImgUrl
                                    ? `url(${station.stationImgUrl})`
                                    : 'none',
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleClick}
                            role="button"
                        >
                            {isHovered ? (
                                <>
                                    {svgs.editIcon}
                                    <span className="edit-station-img-hover-text">Choose Photo</span>
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
                        onChange={(ev) => setEditedName(ev.target.value)}
                    />
                    <textarea
                        className="station-description"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                    />
                    <button onClick={onSave} className="btn-save-station">Save</button>
                    <p className="station-disclaimer">By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</p>
                </main>
            </div>
        </div>
    )
}