import { useState, useEffect } from 'react'
import { EditStationDetails } from './EditStationDetails.jsx'
import { userService } from '../services/user'
import { stationService } from '../services/station/station.service.local.js'

export function DetailsHeader({ station, dominantColor, Svgs, onSave }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editedName, setEditedName] = useState(station.name)
  const [description, setDescription] = useState(station.description || '')

  const loggedinUser = userService.getLoggedinUser()
  const creatorName = station.createdBy?.fullname || loggedinUser?.fullname || 'Guest'
  const isCreator = loggedinUser?._id === station.createdBy?._id
  const numOfSongs = station.songs?.length || 0
  const stationDuration = userService.getTotalSongsDuration(station)
  const headerBackground = `linear-gradient(to bottom, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.75)), rgb(${dominantColor.join(',')})`

  useEffect(() => {
    setEditedName(station.name || '')
    setDescription(station.description || '')
  }, [station])

  async function handleSave(ev) {
    ev?.preventDefault?.()
    try {
      const updatedStation = { ...station, name: editedName, description }
      await onSave(updatedStation)
      await stationService.save(updatedStation)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to update station:', err)
    }
  }

  return (
    <section className="details-header-container flex" style={{ background: headerBackground }}>
      <div
        className="btn-station-img-container grid"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`btn-station-img ${station.stationImgUrl ? 'has-img' : 'no-img'}`}
          style={
            station.stationImgUrl
              ? { backgroundImage: `url(${station.stationImgUrl})` }
              : { backgroundColor: `rgb(${dominantColor.join(',')})` }
          }
        >
          <div className='station-img-hover-cover'>
            <div className="station-img-edit flex">
              {isHovered && (
                <>
                  {Svgs.editIcon}
                  <span className="station-img-edit-text">Choose Photo</span>
                </>
              )}
              {!station.stationImgUrl && !isHovered && Svgs.stationNewImg}
            </div>
          </div>
        </div>
      </div>

      <div className="details-header-text grid">
        <p className="station-type">Public Playlist</p>
        <div
          className="details-station station-name ellipses"
          onClick={() => isCreator && setIsModalOpen(true)}
          style={{ cursor: isCreator ? 'pointer' : 'default' }}
        >
          {station.name}
        </div>
        <div className="station-creator flex">
          <p className="station-details-info">
            <span className="station-creator-name">{creatorName}</span>
            {numOfSongs > 0 && (
              <>
                <span className="station-creator-name">&nbsp;•&nbsp;</span>
                <span className="station-info">
                  {numOfSongs} {numOfSongs === 1 ? 'Song' : 'Songs'}, {stationDuration}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {isCreator && isModalOpen && (
        <EditStationDetails
          station={station}
          Svgs={Svgs}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editedName={editedName}
          setEditedName={setEditedName}
          description={description}
          setDescription={setDescription}
          dominantColor={dominantColor}
          setDominantColor={() => { }}
        />
      )}
    </section>
  )
}
