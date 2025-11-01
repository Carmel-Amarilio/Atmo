import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/actions/user.actions'
import LogoImg from '../assets/img/Logo1.png'

export function AppHeader() {
    const loggedinUser = useSelector((storeState) => storeState.userModule.user)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [cloudService, setCloudService] = useState('All')
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedinUser) navigate('/')
    }, [loggedinUser, navigate])

    function toggleMenu() {
        setIsMenuOpen((prev) => !prev)
    }

    function onLogout() {
        logout()
        navigate('/')
    }

    function handleOption(option) {
        setCloudService(option)
        setIsMenuOpen(false)
    }

    return (
        <header className="app-header flex align-center justify-between">
            <div className="main-logo flex align-center gap10" onClick={() => navigate('/')}>
                <img src={LogoImg} alt="Atmo Logo" />
                <h1>Atmo</h1>
            </div>

            {loggedinUser && (
                <div className="user-section">
                    <div className="user-btn flex gap10" onClick={toggleMenu}>
                        <div className="user-icon flex align-center justify-center">
                            {loggedinUser.userName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="cloud-label">{cloudService}</span>
                    </div>

                    {isMenuOpen && (
                        <div className="user-menu">
                            {['All', 'AWS', 'Azure', 'GCP'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOption(option)}
                                    className={cloudService === option ? 'selected' : ''}
                                >
                                    {option}
                                </button>
                            ))}
                            <hr />
                            <button onClick={onLogout} className="logout-btn">
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
