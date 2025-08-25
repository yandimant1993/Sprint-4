import { useState } from "react"
import { SideNavHeader } from "./SideNavHeader";
import { StationList } from "./StationList";

export function SideNav({ stations }) {
    const [isExpanded, setIsExpanded] = useState(true)
    if (!stations) return
    return (
        <section className={`side-nav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            <StationList stations={stations} />
        </section>
    )
}