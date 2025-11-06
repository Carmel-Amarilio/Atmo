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
        console.log('Logged in user:', loggedinUser)
    }, [loggedinUser, navigate])

    function toggleMenu() {
        setIsMenuOpen((prev) => !prev)
    }

    function onLogout() {
        logout()
        navigate('/')
    }

    function handleOption(option) {
        if (!option.enabled) return
        setCloudService(option.name)
        setIsMenuOpen(false)
    }

    const cloudOptions = [
        { name: 'All', enabled: true },

        {
            name: 'AWS',
            enabled:
                loggedinUser?.cloudPermissions?.AWS?.EnableEC2Access ||
                loggedinUser?.cloudPermissions?.AWS?.EnableBillingAccess ||
                loggedinUser?.cloudPermissions?.AWS?.EnableLoggingAccess,
        },

        {
            name: 'Azure',
            enabled:
                !!loggedinUser?.cloudPermissions?.Azure?.applicationId &&
                !!loggedinUser?.cloudPermissions?.Azure?.directoryId &&
                !!loggedinUser?.cloudPermissions?.Azure?.subscriptionId,
        },

        {
            name: 'GCP',
            enabled:
                !!loggedinUser?.cloudPermissions?.GCP?.projectId &&
                !!loggedinUser?.cloudPermissions?.GCP?.projectNumber,
        },
    ]

    return (
        <header className="app-header flex align-center justify-between">
            <div
                className="main-logo flex align-center gap10"
                onClick={() => navigate('/action')}
            >
                <img src={LogoImg} alt="Atmo Logo" />
                <h1>Atmo</h1>
            </div>

            {loggedinUser && (
                <div className="user-section">
                    <div
                        className="user-btn flex align-center space-between"
                        onClick={toggleMenu}
                    >
                        <div className="user-icon flex align-center justify-center">
                            {loggedinUser.userName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="cloud-label">{cloudService}</span>
                    </div>

                    {isMenuOpen && (
                        <div className="user-menu">
                            {cloudOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={() => handleOption(option)}
                                    disabled={!option.enabled}
                                    className={`${cloudService === option.name ? 'selected' : ''} ${
                                        !option.enabled ? 'disabled' : ''
                                    }`}
                                >
                                    {option.name}
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
