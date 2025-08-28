import { Svgs } from './Svgs.jsx'

export function SideNavHeader({ setIsExpanded, isExpanded, createStation }) {
	function toggleExpand() {
		setIsExpanded(prev => !prev)
	}

	return (
		<section className="sidenav-header flex">
			<button className="btn-sidenav-toggle" onClick={toggleExpand}>
				{isExpanded ? 'Your Library' : 'Expand'}
			</button>
			<button className="btn-create-station flex" onClick={createStation}>
				{Svgs.addIcon}
				{isExpanded && ' Create'}
			</button>
		</section>
	)
}
