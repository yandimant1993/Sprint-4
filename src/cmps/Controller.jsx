import { MediaController } from './MediaController'

// export function Controller({ player, currentTime, duration, onTimeUpdate, onProgressChange, onNext, onPrev }) {
//     return (
//         <>
//             <MediaController
//                 player={player}
//                 currentTime={currentTime}
//                 duration={duration}
//                 onTimeUpdate={onTimeUpdate}
//                 onProgressChange={onProgressChange}
//                 onNext={onNext}
//                 onPrev={onPrev}
//             />
//         </>
//     )
// }
export function Controller({ onNext, onPrev }) {
    return (
        <>
            <MediaController
                onNext={onNext}
                onPrev={onPrev}
            />
        </>
    )
}


