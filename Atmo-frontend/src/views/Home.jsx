import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoImg from '../assets/img/Logo1.png'
import AtmoGraf from '../assets/img/AtmoGraf.png'
import { login, signup } from '../store/actions/user.actions'

export function Home() {
    const navigate = useNavigate()
    const [modalType, setModalType] = useState(null) // 'login' or 'signup'
    const [user, setUser] = useState({ fullname: '', userName: '', password: '' })

    function openModal(type) {
        setModalType(type)
    }

    function closeModal() {
        setModalType(null)
        setUser({ fullname: '', userName: '', password: '' })
    }

    function handleChange({ target }) {
        const { name, value } = target
        setUser((prevUser) => ({ ...prevUser, [name]: value }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        try {
            if (modalType === 'login') await login(user)
            else await signup(user)

            navigate('/action')
            closeModal()
        } catch (error) {
            console.log('Auth failed:', error)
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
                        <button className="sing-up-btn" onClick={() => openModal('signup')}>
                            Sign up
                        </button>
                        <button className="sing-in-btn" onClick={() => openModal('login')}>
                            Sign in
                        </button>
                    </div>
                </div>
            </article>

            {modalType && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{modalType === 'login' ? 'Sign In' : 'Sign Up'}</h2>
                        <form onSubmit={handleSubmit} className="flex column gap10">
                            {modalType === 'signup' && (
                                <input
                                    type="text"
                                    name="fullname"
                                    value={user.fullname}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    required
                                />)}

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
                            <button type="submit">
                                {modalType === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                        <button className="close-btn" onClick={closeModal}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
