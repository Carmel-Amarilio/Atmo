import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoImg from '../assets/img/Logo1.png'
import AtmoGraf from '../assets/img/AtmoGraf.png'
import { login, signup } from '../store/actions/user.actions'

export function Home() {
    const navigate = useNavigate()
    const [modalType, setModalType] = useState(null)
    const [user, setUser] = useState({
        userName: '',
        password: '',
        cloudPermissions: {
            AWS: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false },
            Azure: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false },
            GCP: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false }
        }
    })

    function openModal(type) {
        setModalType(type)
    }

    function closeModal() {
        setModalType(null)
        setUser({
            userName: '',
            password: '',
            cloudPermissions: {
                AWS: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false },
                Azure: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false },
                GCP: { EnableBillingAccess: false, EnableLoggingAccess: false, EnableEC2Access: false }
            }
        })
    }

    function handleChange({ target }) {
        const { name, value } = target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    function handlePermissionChange(cloud, permission) {
        setUser(prev => ({
            ...prev,
            cloudPermissions: {
                ...prev.cloudPermissions,
                [cloud]: {
                    ...prev.cloudPermissions[cloud],
                    [permission]: !prev.cloudPermissions[cloud][permission]
                }
            }
        }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        try {
            if (modalType === 'login') {
                await login(user)
                navigate('/action')
            } else {
                await signup(user)

                const aws = user.cloudPermissions.AWS
                const url = new URL(
                    'https://us-east-1.console.aws.amazon.com/cloudformation/home'
                )
                url.search = new URLSearchParams({
                    region: 'us-east-1',
                }).toString()

                const stackURL = `https://cf-templates-are68nlo622d-us-east-1.s3.us-east-1.amazonaws.com/2025-10-28T153743.647Zgf9-mcp-cross-account-role.yaml`

                const fullUrl = `${url}#/stacks/quickcreate?templateURL=${encodeURIComponent(
                    stackURL
                )}&stackName=atmo-stack&param_ExternalAccountId=268811324372&param_EnableEC2Access=${
                    aws.EnableEC2Access
                }&param_EnableBillingAccess=${
                    aws.EnableBillingAccess
                }&param_EnableLoggingAccess=${aws.EnableLoggingAccess}`

                window.open(fullUrl, '_blank')

                navigate('/action')
            }

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
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modalType === 'login' ? 'Sign In' : 'Sign Up'}</h2>
                        <form onSubmit={handleSubmit} className="flex column gap10">
                            {modalType === 'signup' && (
                                <div className="cloud-access">
                                    <h3>Cloud Access Configuration</h3>
                                    {['AWS', 'Azure', 'GCP'].map(cloud => (
                                        <div key={cloud} className="cloud-group">
                                            <h4>{cloud}</h4>
                                            {['EnableBillingAccess', 'EnableLoggingAccess', 'EnableEC2Access'].map(permission => (
                                                <label key={permission}>
                                                    <input
                                                        type="checkbox"
                                                        checked={user.cloudPermissions[cloud][permission]}
                                                        onChange={() => handlePermissionChange(cloud, permission)}
                                                    />
                                                    {permission.replace('Enable', '').replace('Access', '')}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

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
