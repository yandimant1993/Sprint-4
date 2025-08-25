import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStations, addStation, updateStation, removeStation, addStationMsg } from '../store/actions/station.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { userService } from '../services/user/index.js'

import { StationList } from '../cmps/StationList'
import { StationFilter } from '../cmps/StationFilter.jsx'
import { SideNav } from '../cmps/SideNav.jsx'

export function StationIndex() {
    const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        loadStations()
    }, [filterBy])

    async function onRemoveStation(stationId) {
        try {
            await removeStation(stationId)
            showSuccessMsg('Station removed')
        } catch (err) {
            showErrorMsg('Cannot remove station')
        }
    }

    async function onAddStation() {
        const station = stationService.getEmptyStation()
        station.name = prompt('Name?', 'Some Name')
        try {
            const savedStation = await addStation(station)
            showSuccessMsg(`Station added (id: ${savedStation._id})`)
        } catch (err) {
            showErrorMsg('Cannot add station')
        }
    }

    async function onUpdateStation(station) {
        const addedat = +prompt('New addedat?', station.addedat) || 0
        if (addedat === 0 || addedat === station.addedat) return

        const stationToSave = { ...station, addedat }
        try {
            const savedStation = await updateStation(stationToSave)
            showSuccessMsg(`Station updated, new addedat: ${savedStation.addedat}`)
        } catch (err) {
            showErrorMsg('Cannot update station')
        }
    }

    return (
        <>
            <section className="station-index">
                <header>
                    <h2 className="placeholder">StationsIndex placeholder</h2>
                    {userService.getLoggedinUser() && <button onClick={onAddStation}>Add a Station</button>}
                </header>
                <section className="main-list">
                    <SideNav stations={stations} />
                    <StationList
                        stations={stations}
                        onRemoveStation={onRemoveStation}
                        onUpdateStation={onUpdateStation} />
                </section>
            </section>
        </>
    )
}