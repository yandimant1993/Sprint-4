import { MediaController } from './MediaController'

// export function Controller({ player, currentTime, duration, onTimeUpdate, onProgressChange, onNext, onPrev }) {
export function Controller({ player, currentTime, onTimeUpdate, onProgressChange, onNext, onPrev }) {
    return (
        <>
            <MediaController
                player={player}
                currentTime={currentTime}
                // duration={duration}
                onTimeUpdate={onTimeUpdate}
                onProgressChange={onProgressChange}
                onNext={onNext}
                onPrev={onPrev}
            />
        </>
    )
}


