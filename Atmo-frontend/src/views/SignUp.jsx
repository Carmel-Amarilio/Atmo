import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../store/actions/user.actions'

import LogoImg from '../assets/img/Logo1.png'
import AWSImg from '../assets/img/aws.svg'
import AzureImg from '../assets/img/azure.svg'
import GCPImg from '../assets/img/gcp.svg'

export function SignUp() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [connectedClouds, setConnectedClouds] = useState({ AWS: false, Azure: false, GCP: false })
    const [awsConfig, setAwsConfig] = useState({
        EnableBillingAccess: false,
        EnableLoggingAccess: false,
        EnableEC2Access: false,
        arn: ''
    })
    const [user, setUser] = useState({ userName: '', password: '' })

    function handleUserChange({ target }) {
        const { name, value } = target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    function handleAwsToggle(key) {
        setAwsConfig(prev => ({ ...prev, [key]: !prev[key] }))
    }

    async function handleSignup() {
        const finalUser = {
            ...user,
            cloudPermissions: {
                AWS: awsConfig,
                Azure: {},
                GCP: {}
            }
        }
        try {
            console.log(finalUser);

            await signup(finalUser)
            navigate('/action')
        } catch (err) {
            console.log('Signup failed:', err)
        }
    }

    function generateAwsLink() {
        const base =
            'https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate'
        const template =
            'https://cf-templates-are68nlo622d-us-east-1.s3.us-east-1.amazonaws.com/2025-10-28T153743.647Zgf9-mcp-cross-account-role.yaml'
        const params = new URLSearchParams({
            templateURL: template,
            stackName: 'atmo-stack',
            param_ExternalAccountId: '268811324372',
            param_EnableEC2Access: awsConfig.EnableEC2Access,
            param_EnableBillingAccess: awsConfig.EnableBillingAccess,
            param_EnableLoggingAccess: awsConfig.EnableLoggingAccess
        })
        return `${base}?${params.toString()}`
    }

    return (
        <section className="sign-up flex column align-center justify-center">
            <div className="signup-card">
                <div className="logo-area flex align-center gap10">
                    <img src={LogoImg} alt="Atmo" />
                    <h1>Atmo</h1>
                </div>

                <div className="progress-bar">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}></div>
                </div>

                {step === 1 && (
                    <div className="signup-step fade-in">
                        <h2>Welcome to Atmo ☁️</h2>
                        <p>Create your account to start connecting your clouds.</p>
                        <input
                            type="text"
                            name="userName"
                            placeholder="User Name"
                            value={user.userName}
                            onChange={handleUserChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleUserChange}
                            required
                        />
                        <button onClick={() => setStep(2)} className="primary-btn">
                            Next →
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="cloud-select fade-in">
                        <h2>Connect Your Clouds</h2>
                        <p>Select which cloud providers you’d like to connect.</p>
                        <div className="cloud-grid">
                            <div
                                className={`cloud-card ${connectedClouds.AWS ? 'connected' : ''}`}
                                onClick={() => setStep(3)}
                            >
                                <img src={AWSImg} alt="AWS" />
                                {connectedClouds.AWS && <div className="status-badge">Connected ✅</div>}
                            </div>

                            <div className={`cloud-card ${connectedClouds.Azure ? 'disabled' : ''}`}>
                                <img src={AzureImg} alt="Azure" />
                                <div className="status-badge">Coming soon</div>
                            </div>

                            <div className={`cloud-card ${connectedClouds.GCP ? 'disabled' : ''}`}>
                                <img src={GCPImg} alt="GCP" />
                                <div className="status-badge">Coming soon</div>
                            </div>
                        </div>
                        <button onClick={handleSignup} className="primary-btn">
                            Finish & Create Account
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="aws-connect fade-in">
                        <h2>AWS Configuration</h2>
                        <p>Select the permissions Atmo can access.</p>
                        <div className="toggles">
                            {['EnableBillingAccess', 'EnableLoggingAccess', 'EnableEC2Access'].map(key => (
                                <label key={key} className="toggle-option">
                                    <input type="checkbox" checked={awsConfig[key]} onChange={() => handleAwsToggle(key)} />
                                    {key.replace('Enable', '').replace('Access', '')}
                                </label>
                            ))}
                        </div>

                        <a href={generateAwsLink()} target="_blank" rel="noreferrer" className="aws-btn">
                            ⚙️ Open AWS CloudFormation
                        </a>

                        <div className="arn-input flex column">
                            <label>AWS Role ARN</label>
                            <input
                                type="text"
                                placeholder="arn:aws:iam::123456789012:role/Atmo-Role"
                                value={awsConfig.arn}
                                onChange={e => setAwsConfig(prev => ({ ...prev, arn: e.target.value }))}
                            />
                        </div>

                        <div className="btns flex gap20 justify-center">
                            <button onClick={() => setStep(2)} className="secondary-btn">
                                ← Back
                            </button>
                            <button
                                onClick={() => {
                                    setConnectedClouds(prev => ({ ...prev, AWS: true }))
                                    setStep(2)
                                }}
                                className="primary-btn"
                            >
                                Save & Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
