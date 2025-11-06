import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const GEMINI_API_KEY = "AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM";

export const atmoCostService = {
  costAI,
};


export async function costAI( user) {
   return {
        "byProvider": [
            { "provider": "AWS", "cost": 1240 },
            { "provider": "Azure", "cost": 870 },
            { "provider": "GCP", "cost": 560 }
        ],
        "trend": [
            { "month": "May", "total": 2100 },
            { "month": "Jun", "total": 1950 },
            { "month": "Jul", "total": 1800 },
            { "month": "Aug", "total": 1750 },
            { "month": "Sep", "total": 1820 },
            { "month": "Oct", "total": 1710 }
        ],
        "recommendations": [
            {
                "title": "Use AWS Spot Instances",
                "text": "Your EC2 usage shows 60% of instances are on-demand. Switching 30% to spot can save 25% monthly.",
                "impact": 25
            },
            {
                "title": "Remove Idle GCP Storage",
                "text": "Detected 4 inactive buckets older than 90 days.",
                "impact": 8
            },
            {
                "title": "Optimize Azure SQL",
                "text": "Your Azure SQL instances are running at 15% CPU utilization.",
                "impact": 10
            }
        ]
    }

}
