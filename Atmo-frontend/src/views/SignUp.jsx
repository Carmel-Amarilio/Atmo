import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../store/actions/user.actions"

import LogoImg from "../assets/img/Logo1.png"
import AWSImg from "../assets/img/aws.svg"
import AzureImg from "../assets/img/azure.svg"
import GCPImg from "../assets/img/gcp.svg"

export function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [connectedClouds, setConnectedClouds] = useState({
    AWS: false,
    Azure: false,
    GCP: false,
  })

  const [awsConfig, setAwsConfig] = useState({
    EnableBillingAccess: false,
    EnableLoggingAccess: false,
    EnableEC2Access: false,
    arn: "",
    externalId: "",
  })

  const [gcpConfig, setGcpConfig] = useState({
    projectId: "",
    projectNumber: "",
    serviceAccountKey: null,
  })

  const [azureConfig, setAzureConfig] = useState({
    applicationId: "",
    directoryId: "",
    clientSecret: "",
    subscriptionId: "",
  })

  const [user, setUser] = useState({ userName: "", password: "" })

  useEffect(() => {
    const randomExternalId = `atmo-${Math.random().toString(36).substring(2, 10)}`
    setAwsConfig(prev => ({ ...prev, externalId: randomExternalId }))
  }, [])

  function handleUserChange({ target }) {
    const { name, value } = target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  function handleAwsToggle(key) {
    setAwsConfig(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleGcpChange({ target }) {
    const { name, value } = target
    setGcpConfig(prev => ({ ...prev, [name]: value }))
  }

  function handleAzureChange({ target }) {
    const { name, value } = target
    setAzureConfig(prev => ({ ...prev, [name]: value }))
  }

  function handleGcpFile(e) {
    const file = e.target.files[0]
    setGcpConfig(prev => ({ ...prev, serviceAccountKey: file }))
  }

  async function handleSignup() {
    const finalUser = {
      ...user,
      cloudPermissions: {
        AWS: awsConfig,
        GCP: gcpConfig,
        Azure: azureConfig,
      },
    }

    try {
      console.log("🟢 Final signup payload:", finalUser)
      await signup(finalUser)
      navigate("/action")
    } catch (err) {
      console.error("Signup failed:", err)
    }
  }

  function generateAwsLink() {
    const base =
      "https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate"
    const template =
      "https://cf-templates-are68nlo622d-us-east-1.s3.us-east-1.amazonaws.com/mcp-cross-account-role.yaml"
    const params = new URLSearchParams({
      templateURL: template,
      stackName: "atmo-stack",
      param_ExternalId: awsConfig.externalId,
      param_EnableEC2Access: awsConfig.EnableEC2Access,
      param_EnableBillingAccess: awsConfig.EnableBillingAccess,
      param_EnableLoggingAccess: awsConfig.EnableLoggingAccess,
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
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className={`step ${step >= n ? "active" : ""}`}></div>
          ))}
        </div>

        {/* STEP 1 - ACCOUNT INFO */}
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

        {/* STEP 2 - CHOOSE CLOUDS */}
        {step === 2 && (
          <div className="cloud-select fade-in">
            <h2>Connect Your Clouds</h2>
            <p>Select which cloud providers you’d like to connect.</p>
            <div className="cloud-grid">
              <div
                className={`cloud-card ${connectedClouds.AWS ? "connected" : ""}`}
                onClick={() => setStep(3)}
              >
                <img src={AWSImg} alt="AWS" />
                {connectedClouds.AWS && <div className="status-badge">Connected ✅</div>}
              </div>

              <div
                className={`cloud-card ${connectedClouds.GCP ? "connected" : ""}`}
                onClick={() => setStep(4)}
              >
                <img src={GCPImg} alt="GCP" />
                {connectedClouds.GCP && <div className="status-badge">Connected ✅</div>}
              </div>

              <div
                className={`cloud-card ${connectedClouds.Azure ? "connected" : ""}`}
                onClick={() => setStep(5)}
              >
                <img src={AzureImg} alt="Azure" />
                {connectedClouds.Azure && <div className="status-badge">Connected ✅</div>}
              </div>
            </div>

            <button onClick={handleSignup} className="primary-btn">
              Finish & Create Account
            </button>
          </div>
        )}

        {/* STEP 3 - AWS */}
        {step === 3 && (
          <div className="aws-connect fade-in">
            <h2>AWS Configuration</h2>
            <p>Select the permissions Atmo can access.</p>

            <div className="toggles">
              {["EnableBillingAccess", "EnableLoggingAccess", "EnableEC2Access"].map(key => (
                <label key={key} className="toggle-option">
                  {key.replace("Enable", "").replace("Access", "")}
                  <input
                    type="checkbox"
                    checked={awsConfig[key]}
                    onChange={() => handleAwsToggle(key)}
                  />
                </label>
              ))}
            </div>

            <a href={generateAwsLink()} target="_blank" rel="noreferrer" className="aws-btn">
              Open AWS CloudFormation
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

        {/* STEP 4 - GCP */}
        {step === 4 && (
          <div className="gcp-connect fade-in">
            <h2>GCP Configuration</h2>
            <p>Follow these steps to connect your GCP project:</p>

            <ol className="gcp-steps">
              <li>Open your <a href="https://console.cloud.google.com/projectselector2/home/dashboard" target="_blank" rel="noreferrer">GCP Project Settings</a>.</li>
              <li>Copy your Project ID and Project Number.</li>
              <li>Enable the required APIs by running the command below.</li>
            </ol>

            <div className="gcp-inputs">
              <label>Project ID</label>
              <input
                type="text"
                name="projectId"
                value={gcpConfig.projectId}
                onChange={handleGcpChange}
                placeholder="e.g., atmo-cloud-123456"
              />

              <label>Project Number</label>
              <input
                type="text"
                name="projectNumber"
                value={gcpConfig.projectNumber}
                onChange={handleGcpChange}
                placeholder="e.g., 987654321000"
              />
            </div>

            <div className="gcp-command-box">
              <code>
                gcloud services enable compute.googleapis.com storage.googleapis.com iam.googleapis.com logging.googleapis.com monitoring.googleapis.com
              </code>
            </div>

            <div className="file-upload">
              <label>Upload Service Account JSON Key</label>
              <input type="file" accept=".json" onChange={handleGcpFile} />
            </div>

            <div className="btns flex gap20 justify-center">
              <button onClick={() => setStep(2)} className="secondary-btn">
                ← Back
              </button>
              <button
                onClick={() => {
                  setConnectedClouds(prev => ({ ...prev, GCP: true }))
                  setStep(2)
                }}
                className="primary-btn"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 - AZURE */}
        {step === 5 && (
          <div className="azure-connect fade-in">
            <h2>Azure Configuration</h2>
            <p>Follow these steps to connect your Azure account:</p>

            <ol className="azure-steps">
              <li>Go to your <a href="https://portal.azure.com/" target="_blank" rel="noreferrer">Azure Portal</a>.</li>
              <li>Create a new <b>App Registration</b> under Microsoft Entra ID.</li>
              <li>Copy the Application ID and Directory ID below.</li>
            </ol>

            <div className="azure-inputs">
              <label>Application ID</label>
              <input
                type="text"
                name="applicationId"
                value={azureConfig.applicationId}
                onChange={handleAzureChange}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />

              <label>Directory ID</label>
              <input
                type="text"
                name="directoryId"
                value={azureConfig.directoryId}
                onChange={handleAzureChange}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />

              <label>Client Secret</label>
              <input
                type="password"
                name="clientSecret"
                value={azureConfig.clientSecret}
                onChange={handleAzureChange}
                placeholder="•••••••••••••••••"
              />

              <label>Subscription ID</label>
              <input
                type="text"
                name="subscriptionId"
                value={azureConfig.subscriptionId}
                onChange={handleAzureChange}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>

            <div className="btns flex gap20 justify-center">
              <button onClick={() => setStep(2)} className="secondary-btn">
                ← Back
              </button>
              <button
                onClick={() => {
                  setConnectedClouds(prev => ({ ...prev, Azure: true }))
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
