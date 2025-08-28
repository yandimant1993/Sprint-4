import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"

import { Svgs } from "./Svgs"
import { setCurrentStation, setIsPlaying } from "../store/actions/player.actions"
import { removeStation } from "../store/actions/station.actions"
import { ContextMenu } from "./ContextMenu";
import { SongList } from "./SongList"

const songs = [
    {
        id: 's001',
        title: 'Sunset Drive',
        album: 'Lofi Nights',
        dateAdded: '2025-08-01T12:30:00Z',
        duration: '3:24',
        imgUrl: 'https://placehold.co/40x40'
    },
    {
        id: 's002',
        title: 'Rainy Nights',
        album: 'Quiet Storm',
        dateAdded: '2025-08-05T09:15:00Z',
        duration: '4:12',
        imgUrl: 'https://placehold.co/40x40'
    },
    {
        id: 's003',
        title: 'Electric Feel',
        album: 'Indie Classics',
        dateAdded: '2025-08-10T14:05:00Z',
        duration: '3:49',
        imgUrl: 'https://placehold.co/40x40'
    },
    {
        id: 's004',
        title: 'Youth',
        album: 'Acoustic Moods',
        dateAdded: '2025-08-15T18:22:00Z',
        duration: '4:01',
        imgUrl: 'https://placehold.co/40x40'
    },
    {
        id: 's005',
        title: 'Nightcall',
        album: 'Synthwave Drive',
        dateAdded: '2025-08-20T11:00:00Z',
        duration: '5:05',
        imgUrl: 'https://placehold.co/40x40'
    }
]

export function DetailsMain() {
    const navigate = useNavigate()

    const station = useSelector(storeState => storeState.stationModule.station)
    const currentStation = useSelector(state => state.playerModule.currentStation)
    const isPlaying = useSelector(state => state.playerModule.isPlaying)

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

    const handleContextMenu = (e) => {
        e.preventDefault()
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setMenuOpen(true)
    };

    const handlePlayPause = () => {
        if (currentStation?._id === station._id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentStation(station)
            setIsPlaying(true)
        }
    }

    const isThisStationPlaying = currentStation?._id === station._id && isPlaying

    function onRemoveSong() {
        console.log('clicked on removesong')
    }

    return (
        <>
            <section className="station-details-controller flex">
                <div className="svg-play" onClick={handlePlayPause}>
                    {isThisStationPlaying ? Svgs.pause : Svgs.play}
                </div>
                <button className="btn-delete-station" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Station
                </button>
            </section>

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

            <SongList songs={songs} onRemoveSong={onRemoveSong} />
        </>
    )
}
