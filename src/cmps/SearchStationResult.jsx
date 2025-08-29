export function SearchStationResult({ videos, onVideoClick }) {
    return (
        <>

            {videos.length > 0 && (
                <div className="search-results">
                    {videos.map(video => (
                        <div key={video.id} className="video-item" onClick={() => onVideoClick(video)}>
                            <img src={video.thumbnail} alt={video.title} />
                            <p>{video.title}</p>
                        </div>
                    ))}
                </div>
            )}

        </>
    )
}
