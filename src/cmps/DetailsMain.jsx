import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

import { setCurrentStation, setIsPlaying } from "../store/actions/player.actions"
import { stationService } from "../services/station/station.service.local"
import { removeStation } from "../store/actions/station.actions"
import { Svgs } from "./Svgs"
import { SongList } from "./SongList"
import { ContextMenu } from "./ContextMenu"

export function DetailsMain() {
    const navigate = useNavigate()

    const station = useSelector(storeState => storeState.stationModule.station)
    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)

    const [songs, setSongs] = useState(station.songs || [])
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


    function handleContextMenu(ev) {
        const rect = ev.currentTarget.getBoundingClientRect()
        setMenuPosition({ x: rect.left, y: rect.bottom })
        setMenuOpen(true)
    }



    const handlePlayPause = () => {
        if (currentStation?._id === station._id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentStation(station)
            setIsPlaying(true)
        }
    }

    const isThisStationPlaying = currentStation?._id === station._id && isPlaying

    async function onRemoveSong(songId) {
        try {
            const updatedStation = await stationService.removeSong(songId, station._id)
            setSongs(updatedStation.songs)
            console.log('song removed!')

        } catch (error) {
            // console.log('failed to delete song!')
        }
    }

    async function onAddSong(song) {
        const updatedStation = await stationService.addSong(song)
    }

    return (
        <>
            <section className="station-details-controller flex">
                {station?.songs?.length > 0 &&
                    <div className="svg-play" onClick={handlePlayPause}>
                        {isThisStationPlaying ? Svgs.pause : Svgs.play}
                    </div>
                }
                <button className="btn-context-menu" onClick={handleContextMenu}>
                    {Svgs.threeDotsIcon}
                </button>
            </section>

            <ContextMenu
                isOpen={menuOpen}
                position={menuPosition}
                onClose={() => setMenuOpen(false)}
                items={[
                    {
                        label: "Delete station",
                        onClick: () => setIsDeleteModalOpen(true),
                    },
                ]}
            />

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

            <SongList songs={songs} onRemoveSong={onRemoveSong} onAddSong={onAddSong} />
        </>
    )
}
