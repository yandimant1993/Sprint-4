import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StationFilter } from './StationFilter.jsx'
import { LoginSignup } from '../pages/LoginSignup.jsx'
import { setFilter } from '../store/actions/station.actions'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
	const navigate = useNavigate()

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	function onSetFilter(filterBy) {
		setFilter(filterBy)
	}

	return (
		<header className="app-header full">

			<div className="header-left">
				<div className="logo-container">
					<NavLink to="/" className="logo">
						<span className="logo-text">Spotify</span>
						{/* <img src="/src/assets/spotify-icons/spotify-icon.svg" /> */}
					</NavLink>
				</div>
				<div className="nav-buttons">
					<button className="nav-btn back" disabled>
						<img src="/src/assets/spotify-icons/left-grey-bold.svg" alt="Back" />
					</button>
					<button className="nav-btn forward" disabled>
						<img src="/src/assets/spotify-icons/slide-right.svg" alt="Forward" />
					</button>
				</div>
			</div>


			<div className="header-center">
				<div className="search-container">
					<img src="/src/assets/spotify-icons/search.svg" alt="Search" className="search-icon" />
					<input
						type="text"
						placeholder="What do you want to play?"
						className="search-input"
					/>
				</div>
			</div>


			<div className="header-right">


				<button className="action-btn notification">
					<img src="/src/assets/spotify-icons/notification.svg" alt="Notifications" />
				</button>
				<button className="action-btn friends">
					<img src="/src/assets/spotify-icons/friend-activity.svg" alt="Friends" />
				</button>
				{user ? (
					<div className="user-profile">
						<Link to={`user/${user._id}`}>
							{user.imgUrl ? (
								<img src={user.imgUrl} alt={user.fullname} />
							) : (
								<div className="profile-placeholder">
									{user.fullname?.charAt(0)?.toUpperCase()}
								</div>
							)}
						</Link>
					</div>
				) : (
					<button className="action-btn login" onClick={() => navigate('/auth/login')}>
						Login
					</button>
				)}
			</div>
		</header>
	)
}
