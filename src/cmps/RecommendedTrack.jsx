import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying } from "../store/actions/player.actions"
import { removeStation } from "../store/actions/station.actions"
import { ContextMenu } from "./ContextMenu";
import { SongList } from "./SongList"
// import { removeSong } from "../services/station/station.service.local.js"
import { stationService } from "../services/station/station.service.local"


export function RecommendedTrack() {


    const navigate = useNavigate()

    const station = useSelector(storeState => storeState.stationModule.station)
    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)
    const [songs, setSongs] = useState(station.songs || [])
    // console.log('songs', songs)


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

    async function onDeleteStation() {
        if (!station?._id) return
        try {
            await removeStation(station._id, station.type)
            navigate('/')
        } catch (err) {
            console.error('Failed to delete station:', err)
        }
    }


    async function onRemoveSong(songId) {
        console.log('songId', songId)
        try {
            const updatedStation = await stationService.removeSong(songId, station._id)
            console.log('updatedStation', updatedStation)
            setSongs(updatedStation.songs)
            console.log('song removed!')

        } catch (error) {
            // console.log('failed to delete song!')

        }
    }

    return (
        <>
            <h1>Recommended</h1>
            <p>Based on what's in this playlist</p>

            {/* <section className="station-details-controller flex">
                <div className="svg-play" onClick={handlePlayPause}>
                    {isThisStationPlaying ? Svgs.pause : Svgs.play}
                </div>
                <button className="btn-delete-station" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Station
                </button>
            </section> */}

            {isDeleteModalOpen && (
                <div className="modal-delete-station flex" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-delete-station-container" onClick={ev => ev.stopPropagation()}>
                        <header className="modal-delete-station-header flex">
                            <h2>Delete from Your Library?</h2>
                        </header>
                        {/* <main className="modal-delete-station-main">
                            <p>This will delete <span>{station.name}</span> from <span>Your Library.</span></p>
                            <div className="modal-delete-station-actions">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-cancel-delete">Cancel</button>
                                <button onClick={onDeleteStation} className="btn-confirm-delete">Yes, Delete</button>
                            </div>
                        </main> */}
                    </div>
                </div>
            )}

            <SongList songs={songs} onRemoveSong={onRemoveSong} />
        </>
    )


}


