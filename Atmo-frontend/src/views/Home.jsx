import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoImg from '../assets/img/Logo1.png'
import AtmoGraf from '../assets/img/AtmoGraf.png'
import { login } from '../store/actions/user.actions'

export function Home() {
    const navigate = useNavigate()
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [user, setUser] = useState({ userName: '', password: '' })

    function openLogin() {
        setIsLoginOpen(true)
    }

    function closeLogin() {
        setIsLoginOpen(false)
        setUser({ userName: '', password: '' })
    }

    function handleChange({ target }) {
        const { name, value } = target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    async function handleLogin(ev) {
        ev.preventDefault()
        try {
            await login(user)
            navigate('/action')
            closeLogin()
        } catch (error) {
            console.log('Login failed:', error)
        }
    }

    return (
        <main className="home flex column justify-center align-center">
            <article className="main-logo flex column align-center justify-center gap10">
                <img src={LogoImg} alt="Atmo logo" />
                <h1>Atmo</h1>
                <h2>the clear sky for your cloud</h2>
            </article>

            <article className="scend-logo">
                <img src={AtmoGraf} alt="Atmo illustration" />
                <div className="flex column gap20 align-center justify-center">
                    <h2>Take control of your cloud infrastructure</h2>
                    <p>
                        Atmo collects data across multi-cloud platforms, provides improved
                        visualizations, AI enhancements, and actionable recommendations.
                    </p>
                    <div className="btns flex gap20 justify-center">
                        <button className="sing-up-btn" onClick={() => navigate('/signup')}>
                            Sign up
                        </button>
                        <button className="sing-in-btn" onClick={openLogin}>
                            Sign in
                        </button>
                    </div>
                </div>
            </article>

            {isLoginOpen && (
                <div className="modal-backdrop" onClick={closeLogin}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Sign In</h2>
                        <form onSubmit={handleLogin} className="flex column gap10">
                            <input
                                type="text"
                                name="userName"
                                value={user.userName}
                                onChange={handleChange}
                                placeholder="User Name"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                            <button type="submit">Sign In</button>
                        </form>
                        <button className="close-btn" onClick={closeLogin}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
