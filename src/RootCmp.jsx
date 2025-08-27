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
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'

export function RootCmp() {

    const [searchedVideoId, setSearchedVideoId] = useState(null)

    useEffect(() => {
        autoLoginUser()
    }, [])

    return (
        <Provider store={store}>
            <div className="app-container">
                <AppHeader onSelectVideo={setSearchedVideoId} />
                <UserMsg />
                {/* <main className="main-container grid"> */}
                    <SideNav />
                    <Routes>
                        <Route path="/" element={<StationIndex />} />
                        <Route path="station/:stationId" element={<StationDetails />} />
                        <Route path="auth" element={<LoginSignup />}>
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                {/* </main> */}
                <AppFooter searchedVideoId={searchedVideoId} />
            </div>
        </Provider>
    )
}

