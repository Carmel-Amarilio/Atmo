import { useEffect, useState } from "react";
import { AppHeader } from "../cmps/AppHeader";
import { atmoService } from "../services/Atmo.service";
import loader from "../assets/img/loader.gif";

export function LogAnalysis() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      const res = await atmoService.getLogInsights();
      setData(res);
    } catch (err) {
      console.error("Failed to load log insights", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="log-analyst loading flex column align-center justify-center">
        <img src={loader} alt="Loading..." />
        <h3>Analyzing your cloud logs...</h3>
      </section>
    );
  }

  return (
    <section className="log-analyst flex column align-center justify-center gap20">
      <AppHeader />

      <div className="content">
        <h2>Cloud Log Insights</h2>

        {/* Summary cards */}
        <div className="summary-cards">
          <div className="card">
            <h3>{data.summary.totalLogs.toLocaleString()}</h3>
            <p>Total Logs Processed</p>
          </div>
          <div className="card warning">
            <h3>{data.summary.anomaliesDetected}</h3>
            <p>Anomalies Detected</p>
          </div>
          <div className="card danger">
            <h3>{data.summary.criticalIssues}</h3>
            <p>Critical Issues</p>
          </div>
          <div className="card success">
            <h3>{data.summary.recommendationsCount}</h3>
            <p>AI Recommendations</p>
          </div>
        </div>

        {/* Insights list */}
        <div className="insights-section">
          <h3>Recent Anomalies & Issues</h3>
          {data.insights.map((item, idx) => (
            <div key={idx} className={`insight-card ${item.severity.toLowerCase()}`}>
              <div className="top-row flex space-between">
                <span className="type">{item.type}</span>
                <span className="service">{item.service}</span>
              </div>
              <p className="description">{item.description}</p>
              <p className="time">{new Date(item.time).toLocaleString()}</p>
              <div className="recommendation">
                <strong>Recommendation:</strong> {item.recommendation}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="ai-recommendations">
          <h3>AI Recommendations</h3>
          <ul>
            {data.aiRecommendations.map((rec, idx) => (
              <li key={idx}>💡 {rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
