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
			<StationFilter filterBy={filterBy} onSetFilter={onSetFilter} />
			<nav>
				<NavLink to="/" className="logo">
					E2E Demo
				</NavLink>
				<NavLink to="about">About</NavLink>
				<NavLink to="station">Stations</NavLink>

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
				{user && (
					<div className="user-info">
						<Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							{user.fullname}
						</Link>
						<span className="score">{user.score?.toLocaleString()}</span>
						<button onClick={onLogout}>logout</button>
						<LoginSignup />
					</div>
				)}
			</nav>
		</header>
	)
}
