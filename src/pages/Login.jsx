import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'
import { Signup } from './SignUp'

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
        const user = await login(credentials)
        if (user)
            navigate('/')
        else{
            console.log('hi')
            navigate('/auth/signup')
        }
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    return (
        <div className="login-up">
            <div className="spotify-login">
                <img src="/src/assets/spotify-icons/spotify-whit.png"></img>
            </div>
            <ul className="sign-in-list">
                <li className="sign-in-google">Continue With Google</li>
                <li className="sign-in-google">Continue With Facebook</li>
                <li className="sign-in-google">Continue With Apple</li>

            </ul>
            <div className="email-username">Email or Username</div>
            <input
                type="text"
                className="input-email-username"
                onChange={handleChange}
                value={credentials.username}
                name="username" />
            <input
                type="password"
                className="input-password"
                onChange={handleChange}
                value={credentials.password}
                name="password" />
            <div className="continue-button">
                <button className="continue" onClick={(ev) => onLogin(ev)}>Continue</button>
            </div>
            <div className="no-user">
                <span>Don't have an account?</span> <NavLink to={'/auth/signup'}> Sign up for spotifly</NavLink>
            </div>
        </div>
    )
}

