import { Svgs } from './Svgs.jsx'
import React from 'react'

export function SideNavHeader({ setIsExpanded, isExpanded, createStation }) {
	function toggleExpand() {
		setIsExpanded(prev => !prev)
	}

	return (
		<React.Fragment>
			<section className="sidenav-header flex">
				<button className="btn-sidenav-toggle" onClick={toggleExpand}>
					{isExpanded ? 'Your Library' : Svgs.expandSidenavIcon}
				</button>
				<button className="btn-create-station flex" onClick={createStation}>
					{Svgs.addIcon}
					{isExpanded && ' Create'}
				</button>
			</section>
			<div className="button-playlist">
				<button className="playlist">PlayLists</button>
			</div>
			<div className="header-input">
				<div className="input-svg-container">
					{Svgs.searchIcon}
					<input
						type="text"
						placeholder="Enter Playlist"
						// value={filter}
						onChange={(e) => setFilter(e.target.value)}
					/>
				</div>
			</div>
		</React.Fragment>
	)
}
