import { SortStation } from "./SortStation";
import { StationFilter } from "./StationFilter";

export function SideNavHeader() {
    return (
        <section>
            <SortStation />
            <StationFilter />
        </section>
    )
}