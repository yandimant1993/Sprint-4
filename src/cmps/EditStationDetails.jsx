import { useState, useEffect, useRef } from 'react'
import { Svgs } from './Svgs'
import { uploadService } from '../services/upload.service'
export function EditStationDetails({ station,
    svgs,
    onClose,
    onSave,
    editedName,
    setEditedName,
    description,
    setDescription
}) {
    const fileInputRef = useRef(null)
    const modalRef = useRef()
    // true for ui dev:
    const [isHovered, setIsHovered] = useState(true)
    const [, forceUpdate] = useState(0)

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

    function handleFileClick() {
        fileInputRef.current.click()
    }

    async function handleFileUpload(ev) {
        try {
            const { imgUrl } = await uploadService.uploadImgLocal(ev)
            station.stationImgUrl = imgUrl

            forceUpdate(n => n + 1)
            await stationService.save(station)
        } catch (err) {
            console.error('Failed to upload local image', err)
        }
    }

    return (
        <div className="edit-station-modal-overlay flex" onClick={onClose}>
            <div className="edit-station-modal-container" ref={modalRef} onClick={ev => ev.stopPropagation()}>
                <header className="edit-station-modal-header flex">
                    <h3 className="edit-details-h">Edit details</h3>
                    <button className="btn-edit-close-modal" onClick={onClose}>{Svgs.xIcon}</button>
                </header>
                <main className="edit-station-main grid">
                    <div className="btn-edit-station-img-container" onClick={handleFileClick}>
                        <div
                            className="btn-edit-station-img"
                            style={{ backgroundImage: station.stationImgUrl ? `url(${station.stationImgUrl})` : 'none' }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            role="button"
                        >
                            {station.stationImgUrl && isHovered && (
                                <button
                                    className="btn-remove-img flex"
                                    onClick={ev => {
                                        ev.stopPropagation()
                                        station.stationImgUrl = ''
                                        setIsHovered(false)
                                        forceUpdate(n => n + 1)
                                    }}
                                    title="Remove Image"
                                >
                                    {Svgs.threeDotsIcon}
                                </button>
                            )}
                            <div className="edit-station-img">
                                {isHovered ? (
                                    <>
                                        {Svgs.editIcon}
                                        <span className="edit-station-img-text">Choose Photo</span>
                                    </>
                                ) : (
                                    Svgs.stationNewImg
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div className="station-name-input">
                        <label htmlFor="station-name" className="station-name-label">Name</label>
                        <input
                            type="text"
                            className="station-name input-app"
                            placeholder={station.name}
                            value={editedName}
                            onChange={(ev) => setEditedName(ev.target.value)}
                        />
                    </div>
                    <div className="station-description-input">
                        <label htmlFor="station-description" className="station-description-label">Label</label>
                        <textarea
                            className="station-description input-app"
                            placeholder="Add an optional description"
                            value={description}
                            onChange={(ev) => setDescription(ev.target.value)}
                        />
                    </div>
                    <div className="btn-save-details flex">
                        <div onClick={onSave} className="btn-save-details-shape">Save</div>
                    </div>
                    <p className="station-disclaimer">By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</p>
                </main>
            </div >
        </div >
    )
}