import { Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { StationIndex } from './pages/StationIndex.jsx'
import { StationDetails } from './pages/StationDetails.jsx'
import { autoLoginUser } from './store/actions/user.actions'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { SideNav } from './cmps/SideNav.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login } from './pages/Login.jsx'
// import { Signup } from './pages/SignUp.jsx'
import { UserDetails } from "./pages/UserDetails.jsx"
import { Signup } from './pages/SignUp.jsx'

export function RootCmp() {

    const [searchedVideoId, setSearchedVideoId] = useState(null)
    const [isVisible, setIsVisible] = useState(true)


    useEffect(() => {
        // autoLoginUser()
    }, [])

    return (
        <Provider store={store}>
            <div className="app-container grid">
                <AppHeader onSelectVideo={setSearchedVideoId} />
                <UserMsg />
                <SideNav />
                <Routes>
                    <Route path="/" element={<StationIndex />} />
                    <Route path="station/:stationId" element={<StationDetails />} />
                    <Route path="user/:userId" element={<UserDetails />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <AppFooter searchedVideoId={searchedVideoId} />
            </div>
        </Provider>
    )
}

