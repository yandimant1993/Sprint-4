import React, { useState, useEffect } from 'react'
import { RightControls } from './RightControls'
import { MediaController } from './MediaController'



export function Controller({ player, currentTime, duration, onTimeUpdate, onProgressChange }) {
    return (
        <div className="media-controller">
            <MediaController
                player={player}
                currentTime={currentTime}
                duration={duration}
                onTimeUpdate={onTimeUpdate}
                onProgressChange={onProgressChange}
            />
            {/* <RightControls player={player} /> */}
        </div>
    )
}


