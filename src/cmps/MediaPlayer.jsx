import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

export function MediaPlayer() {
    const audioRef = useRef(null)


    return (
        <div className="media-player">

            <audio
                ref={audioRef}
                style={{ display: 'none' }}

                preload="metadata"
            />


            <div className="player-placeholder">

            </div>
        </div>
    )
}

