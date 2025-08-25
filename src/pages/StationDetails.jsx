import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStation, addStationMsg } from '../store/actions/station.actions'
import { SongList } from '../cmps/SongList'
import { DetailsHeader } from '../cmps/DetailsHeader'
import { DetailsMain } from '../cmps/DetailsMain'


export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])

  async function onAddStationMsg(stationId) {
    try {
      await addStationMsg(stationId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Station msg added`)
    } catch (err) {
      showErrorMsg('Cannot add station msg')
    }
  }

  if (!station) return
  return (
    <section className="station-details">
      <DetailsHeader station={station} />
      <DetailsMain station={station} />
    </section>
  )
}