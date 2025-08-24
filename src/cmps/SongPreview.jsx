import React from 'react'

export function SongPreview() {
    const currentSong = {
        title: "אין פה מקום - מתוך הופעה חיה בבארבי",
        artist: "עידן רפאל חביב",
        // תמונה של זמר על במה עם תאורה אדומה-כתומה
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
    
    return (
        <div className="song-preview">
            <div className="song-image">
                <img 
                    src={currentSong.image} 
                    alt={currentSong.title}
                    onError={(e) => {
                        // Fallback לתמונה מקומית אם התמונה החיצונית לא נטענת
                        e.target.src = '/src/assets/img/sunflowers.jpg'
                    }}
                />
            </div>
            <div className="song-info">
                <div className="song-title">{currentSong.title}</div>
                <div className="song-artist-container">
                    <span className="song-artist">{currentSong.artist}</span>
                    <button className="add-song-btn" title="Add to Library">
                        <img src="/src/assets/spotify-icons/plus.svg" alt="Add" />
                    </button>
                </div>
            </div>
        </div>
    )
}