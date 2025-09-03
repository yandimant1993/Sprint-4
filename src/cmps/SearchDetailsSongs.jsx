import { useState, useEffect } from 'react'
import { getVideos } from "../services/player/youtube.service"
import { SearchStationResult } from './SearchStationResult'

export function SearchDetailsSongs({ addSong,onSelectVideo, stationId }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ term: '' })
    const [videos, setVideos] = useState([])

    useEffect(() => {
        if (!filterByToEdit.term) {
            setVideos([])
            return
        }

        const fetchVideos = async () => {
            const result = await getVideos(filterByToEdit.term, 10)
            setVideos(result)
            console.log('result:', result)
        }

        const timeoutId = setTimeout(fetchVideos, 500)
        return () => clearTimeout(timeoutId)
    }, [filterByToEdit.term])
    function handleChange({ target }) {
        const { value, name: field } = target
        setFilterByToEdit(prev => ({ ...prev, [field]: value }))
    }

    function handleVideoClick(video) {
        if (onSelectVideo) onSelectVideo(video.id)
    }
    return (
        <section className="details-search-container">
            <h1 className="search-welcome-header">Let's find something for your playlist</h1>
            <div className="search-details-song">
                <div className="search-details-input">
                    <img src="/src/assets/spotify-icons/search-iocn-input.svg" alt="Search" className="search-icon" />
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="Search for songs or episodes"
                        className="search-details-input"
                        name="term"
                        value={filterByToEdit.term}
                    />
                </div>

                <SearchStationResult
                    addSong={addSong}
                    videos={videos}
                    onVideoClick={handleVideoClick}
                    stationId={stationId}
                />
            </div>
        </section>
    )
}