import { useState, useEffect } from 'react';
import { getVideos } from "../services/player/youtube.service";
import { SearchStationResult } from './SearchStationResult';

export function SearchStationSongs({ onSelectVideo }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ term: '' });
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (!filterByToEdit.term) return;

        const fetchVideos = async () => {
            const result = await getVideos(filterByToEdit.term, 10);
            setVideos(result);
        };

        const timeoutId = setTimeout(fetchVideos, 500);
        return () => clearTimeout(timeoutId);
    }, [filterByToEdit.term]);

    function handleChange({ target }) {
        const { value, name: field } = target;
        setFilterByToEdit(prev => ({ ...prev, [field]: value }));
    }

    function handleVideoClick(video) {
        if (onSelectVideo) onSelectVideo(video.id);
    }

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <img src="/src/assets/spotify-icons/search-iocn-input.svg" alt="Search" className="search-icon" />
                <input
                    onChange={handleChange}
                    type="text"
                    placeholder="What do you want to play?"
                    className="search-input"
                    name="term"
                    value={filterByToEdit.term}
                />
            </div>
            <SearchStationResult
                videos={videos}
                onVideoClick={handleVideoClick}
            />
            {/* {videos.length > 0 && (
                <div className="search-results">
                    {videos.map(video => (
                        <div key={video.id} className="video-item" onClick={() => handleVideoClick(video)}>
                            <img src={video.thumbnail} alt={video.title} />
                            <p>{video.title}</p>
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
}
