import { useState, useEffect, useRef } from 'react'
import ColorThief from 'colorthief'
import astrixImg from '../assets/img/arjaRam.jpeg'
// import astrixImg from '../assets/img/Astrix-H.e-art.png'

import { updateStation } from '../store/actions/station.actions'
import { Svgs } from './Svgs.jsx'
import { EditStationDetails } from './EditStationDetails.jsx'
import { userService } from '../services/user'

export function DetailsHeader({ station }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedName, setEditedName] = useState(station.name)
    const [description, setDescription] = useState('')

    const loggedinUser = userService.getLoggedinUser()
    const creatorName = station.createdBy?.fullname || loggedinUser?.fullname || 'Guest'
    const isCreator = loggedinUser?._id === station.createdBy?._id

    const [dominantColor, setDominantColor] = useState([0, 0, 0])
    const imgRef = useRef(null)

    useEffect(() => {
        const img = imgRef.current
        if (!img) return

        img.onload = () => {
            const colorThief = new ColorThief()
            const color = colorThief.getColor(img)
            setDominantColor(color)
        }

        if (img.complete) {
            const colorThief = new ColorThief()
            const color = colorThief.getColor(img)
            setDominantColor(color)
        }
    }, [])

    const headerBackground = `linear-gradient(to bottom, rgba(0, 0, 0, 0.13), rgba(0, 0, 0, 0.85)), rgb(${dominantColor.join(',')})`


    async function handleSave(ev) {
        ev?.preventDefault?.()
        try {
            const updatedStation = { ...station, name: editedName, description }
            await updateStation(updatedStation)
            setIsModalOpen(false)
        } catch (err) {
            console.error('Failed to update station:', err)
        }
    }


    return (
        <section
            className="details-header-container flex"
            style={{
                background: headerBackground,
                padding: '16px',
                borderRadius: '8px',
                color: 'white'
            }}
        >
            <img
                ref={imgRef}
                src={astrixImg}
                alt="Station"
                style={{ display: 'none' }}
            />

            <div className="btn-station-img-container grid"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="btn-station-img"
                    style={{
                        width: '230px',
                        height: '230px',
                        backgroundImage: `url(${astrixImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '4px',
                        position: 'relative',
                    }}
                >
                    {isHovered && (
                        <div className="overlay flex-center">
                            {Svgs.editIcon}
                            <span className="hover-text">Choose Photo</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="details-header-text" style={{ marginLeft: '16px' }}>
                <p className="station-type">Public Playlist</p>
                <div
                    className="station-name"
                    onClick={() => isCreator && setIsModalOpen(true)}
                    style={{ cursor: isCreator ? 'pointer' : 'default', fontWeight: '800', fontSize: '24px' }}
                >
                    {station.name}
                </div>
                <div className="station-creator flex">
                    <p className="station-details-info">
                        <span>{creatorName}&nbsp;•&nbsp;</span>6 songs, 19 min 28 sec
                    </p>
                </div>
            </div>

            {isCreator && isModalOpen && (
                <EditStationDetails
                    station={station}
                    svgs={Svgs}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    editedName={editedName}
                    setEditedName={setEditedName}
                    description={description}
                    setDescription={setDescription}
                />
            )}
        </section>
    )
}






// import { useState } from 'react'


// import { updateStation } from '../store/actions/station.actions'
// import { Svgs } from './Svgs.jsx'
// import { EditStationDetails } from './EditStationDetails.jsx'
// import { userService } from '../services/user'

// export function DetailsHeader({ station }) {
//     const [isHovered, setIsHovered] = useState(false)
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [editedName, setEditedName] = useState(station.name)
//     const [description, setDescription] = useState('')

//     const loggedinUser = userService.getLoggedinUser()
//     const creatorName = station.createdBy?.fullname || loggedinUser?.fullname || 'Guest'
//     const isCreator = loggedinUser?._id === station.createdBy?._id

//     async function handleSave(ev) {
//         ev?.preventDefault?.()
//         try {
//             const updatedStation = { ...station, name: editedName, description }
//             await updateStation(updatedStation)
//             setIsModalOpen(false)
//         } catch (err) {
//             console.error('Failed to update station:', err)
//         }
//     }

//     return (
//         <section className="details-header-container flex">
//             <div className="btn-station-img-container grid"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}>
//                 <div className="btn-station-img">
//                     {isHovered ? Svgs.editIcon : Svgs.stationNewImg}
//                 </div>
//                 <p className="hover-text">Choose Photo</p>
//             </div>

//             <div className="details-header-text">
//                 <p className="station-type">
//                     Public Playlist
//                 </p>

//                 <div
//                     className="station-name"
//                     onClick={() => isCreator && setIsModalOpen(true)}
//                     style={{ cursor: isCreator ? 'pointer' : 'default' }}
//                 >
//                     {station.name}
//                 </div>

//                 <div className="station-creator flex">
//                     <p className="station-details-info"><span>{creatorName}&nbsp;•&nbsp;</span> 6 songs, 19 min 28 sec</p>
//                 </div>
//             </div>

//             {isCreator && isModalOpen && (
//                 <EditStationDetails
//                     station={station}
//                     svgs={Svgs}
//                     onClose={() => setIsModalOpen(false)}
//                     onSave={handleSave}
//                     editedName={editedName}
//                     setEditedName={setEditedName}
//                     description={description}
//                     setDescription={setDescription}
//                 />
//             )}
//         </section>
//     )
// }

