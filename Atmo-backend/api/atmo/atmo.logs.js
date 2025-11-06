import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const GEMINI_API_KEY = "AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM";

export const atmoLogsService = {
  logsAI,
};


export async function logsAI( user) {
  return {
        "summary": {
            "totalLogs": 12452,
            "anomaliesDetected": 6,
            "criticalIssues": 2,
            "recommendationsCount": 5
        },
        "insights": [
            {
                "type": "CPU Spike",
                "severity": "High",
                "service": "AWS EC2",
                "time": "2025-11-05T10:32:00Z",
                "description": "Detected sustained 92% CPU utilization in instance i-04a32e7c1.",
                "recommendation": "Consider resizing the instance or enabling auto-scaling to handle burst traffic."
            },
            {
                "type": "Authentication Errors",
                "severity": "Medium",
                "service": "Azure AD",
                "time": "2025-11-04T15:18:00Z",
                "description": "14 failed login attempts detected within 10 minutes.",
                "recommendation": "Enable conditional access or MFA to prevent brute force attacks."
            },
            {
                "type": "Storage Near Capacity",
                "severity": "High",
                "service": "GCP Storage",
                "time": "2025-11-03T21:44:00Z",
                "description": "Bucket `analytics-logs` reached 92% of allocated capacity.",
                "recommendation": "Increase bucket quota or set up lifecycle rules for old logs."
            },
            {
                "type": "Lambda Timeout",
                "severity": "Low",
                "service": "AWS Lambda",
                "time": "2025-11-02T09:27:00Z",
                "description": "Function `report-aggregator` timed out 3 times in 24h.",
                "recommendation": "Review function memory and timeout settings."
            }
        ],
        "aiRecommendations": [
            "Reduce log retention period for low-value services to cut storage costs by ~12%.",
            "Implement centralized logging (e.g., CloudWatch Logs Insights) to detect cross-service issues faster.",
            "Automate anomaly alerts using Atmo Agent to identify spikes within minutes."
        ]
    }
}
