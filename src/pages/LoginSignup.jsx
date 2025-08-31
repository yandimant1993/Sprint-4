import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'

export function LoginSignup() {
    return (
        <div className="login-page">
            {/* <nav>
                <NavLink to="login">Login</NavLink>
                <NavLink to="signup">Signup</NavLink>
            </nav> */}
            <Outlet />
        </div>
    )
}

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username) return
        await login(credentials)
        navigate('/')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    return (
        <div className="login-up">
            <div className="spotift-login">
                <img src="/src/assets/spotify-icons/spotify-whit.png"></img>
            </div>
            <ul className="sign-in-list">
                <li className="sign-in-google">Continue With Google</li>
                <li className="sign-in-google">Continue With Facebook</li>
                <li className="sign-in-google">Continue With Apple</li>

            </ul>
            <div className="email-username">Email or Username</div>
            <input type="text" className="input-email-username" />
            <div className="continue-button">
                <button className="continue">Continue</button>
            </div>
        </div>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <ImgUploader onUploaded={onUploaded} />
            <button>Signup</button>
        </form>
    )
}