import { Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'

import { StationIndex } from './pages/StationIndex.jsx'
import { StationDetails } from './pages/StationDetails.jsx'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { SideNav } from './cmps/SideNav.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'

export function RootCmp() {
    return (
        <Provider store={store}>
            <div className="main-container">
                <AppHeader />
                <UserMsg />
                <SideNav />
                <main>
                    <Routes>
                        <Route path="/" element={<StationIndex />} />
                        <Route path="station/:stationId" element={<StationDetails />} />
                        <Route path="auth" element={<LoginSignup />}>
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Provider>
    )
}


