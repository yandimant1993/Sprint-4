import { SongList } from "./SongList"
import { removeStation } from "../store/actions/station.actions"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"

export function DetailsMain() {
    const navigate = useNavigate()
    const station = useSelector(storeState => storeState.stationModule.station)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    async function onDeleteStation() {
        if (!station?._id) return
        try {
            await removeStation(station._id, station.type)
            navigate('/')
        } catch (err) {
            console.error('Failed to delete station:', err)
        }
    }

    return (
        <>
            <button className="btn-delete-station" onClick={() => setIsDeleteModalOpen(true)}>
                Delete Station
            </button>

            {isDeleteModalOpen && (
                <div className="modal-delete-station flex" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-delete-station-container" onClick={ev => ev.stopPropagation()}>
                        <header className="modal-delete-station-header flex">
                            <h2>Delete from Your Library?</h2>
                        </header>
                        <main className="modal-delete-station-main">
                            <p>This will delete <span>{station.name}</span> from <span>Your Library.</span></p>
                            <div className="modal-delete-station-actions">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-cancel-delete">Cancel</button>
                                <button onClick={onDeleteStation} className="btn-confirm-delete">Yes, Delete</button>
                            </div>
                        </main>
                    </div>
                </div>
            )}

            <SongList />
        </>
    )
}
