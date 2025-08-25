import { SideNavHeader } from "./SideNavHeader";
import { StationList } from "./StationList";

export function SideNav({ stations }) {
    if (!stations) return
    return (
        <section>
            <SideNavHeader />
            <StationList stations={stations} />
        </section>
    )
}