import { useNavigate } from "react-router-dom"

export function MobileNav() {
    const navigate = useNavigate()

    return (
        <div className="footer-nav grid">
            <button className="btn-nav nav-home" onClick={() => navigate('/')}>
                Home
            </button>
            <button className="btn-nav nav-search" onClick={() => navigate('/')}>
                Search
            </button>
            <button className="btn-nav nav-stations" onClick={() => navigate('/')}>
                Your Library
            </button>
            <button className="btn-nav nav-premium" onClick={() => navigate('/')}>
                Premium
            </button>
            <button className="btn-nav nav-create-station" onClick={() => navigate('/')}>
                Create
            </button>
        </div>
    )
}