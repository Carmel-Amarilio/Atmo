import { useState, useEffect } from 'react'
import { AppHeader } from '../cmps/AppHeader'
import { atmoService } from '../services/Atmo.service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import loader from '../assets/img/loader.gif'

export function CostSaving() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const res = await atmoService.getCostSavingDashboard()
      setData(res)
    } catch (err) {
      console.log('Failed to load cost saving data', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="cost-saving flex column align-center justify-center">
        <img src={loader} alt="Loading..." />
        <h3>Analyzing your cloud costs...</h3>
      </section>
    )
  }

  return (
    <section className="cost-saving flex column align-center justify-center gap20">
      <AppHeader />

      <div className="content">
        <h2>Cloud Cost Overview</h2>

        <div className="chart-section">
          <h3>Current Monthly Cost by Cloud</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byProvider}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>Cost Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h3>Atmo Recommendations</h3>
          <div className="cards-grid">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="rec-card">
                <h4>{rec.title}</h4>
                <p>{rec.text}</p>
                <span className="impact"> {rec.impact}% potential saving</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
