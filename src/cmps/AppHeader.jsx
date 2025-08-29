import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { setFilter } from '../store/actions/station.actions'
import { SearchStation } from './SearchStation.jsx'
import { Svgs } from './Svgs.jsx'


export function AppHeader({ onSelectVideo }) {
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
						<img src="/src/assets/spotify-icons/spotify-whit.png" />
					</NavLink>
				</div>

			</div>



			<div className="header-center">

				<NavLink to="/" className="home-icon">
					<img src="/src/assets/spotify-icons/home-solid.svg" alt="home" />
				</NavLink>
				{/* 
				<div className="search-container">
					<img src="/src/assets/spotify-icons/search.svg" alt="Search" className="search-icon" />
					<input
						type="text"
						placeholder="What do you want to play?"
						className="search-input"
					/>
				</div> */}

				<SearchStation onSelectVideo={onSelectVideo} />

			</div>


			<section className="header-right">
				<div className="header-user-actions flex">
					<button className="action-btn notification">
						<img src="/src/assets/spotify-icons/notification.svg" alt="Notifications" />
					</button>
					<button className="action-btn friends">
						<img src="/src/assets/spotify-icons/friend-activity.svg" alt="Friends" />
					</button>
				</div>
				{user ? (
					<div className="user-profile flex">
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
			</section>
		</header>
	)
}
