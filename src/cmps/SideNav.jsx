import { useState } from "react"
import { useSelector } from 'react-redux'
import { SideNavHeader } from "./SideNavHeader";
import { StationList } from "./StationList";

export function SideNav() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <section className={`side-nav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            {stations?.length ? <StationList stations={stations} /> : <p>Loading stations...</p>}
        </section>
    )
}