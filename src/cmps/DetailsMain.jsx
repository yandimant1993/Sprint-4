//     const isThisStationPlaying = currentStation?._id === station._id && isPlaying

import { useState } from "react"
import { useSelector } from 'react-redux'

import { setIsPlaying, setCurrentStation } from '../store/actions/player.actions'
import { updateStation } from '../store/actions/station.actions'
import { userService } from '../services/user'
import { stationService } from "../services/station/station.service.local"
import { StationSongsList } from "./StationSongsList"
import { ContextMenu } from "./ContextMenu"
import { Svgs } from '../cmps/Svgs'
export function DetailsMain({
    station,
    songs,
    removeSong,
    onDeleteStation,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleContextMenu
}) {
    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const handlePlayPause = () => {
        if (currentStation?._id === station._id) {
            setIsPlaying()
        } else {
            setCurrentStation(station)
            setIsPlaying(true)
        }
    }

    function handleContextMenu(ev) {
        const rect = ev.currentTarget.getBoundingClientRect()
        setMenuPosition({ x: rect.left, y: rect.bottom })
        setMenuOpen(true)
    }

    async function onToggleLikedSong(song) {
        try {
            const updatedStation = await stationService.toggleLikedSongs(song)
            // console.log('updatedStation: ', updatedStation)
            updateStation(updatedStation)
        } catch (err) {
            console.error('Failed to toggle liked song:', err)
        }
    }

    return (
        <>
            <section className="station-details-controller flex">
                {station?.songs?.length > 0 && (
                    <div className="svg-play" onClick={handlePlayPause}>
                        {isPlaying ? Svgs.pause : Svgs.play}
                    </div>
                )}
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

            <StationSongsList songs={station.songs} removeSong={removeSong} onToggleLikedSong={onToggleLikedSong} />
        </>
    )
}
