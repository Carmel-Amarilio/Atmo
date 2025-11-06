// import fetch from "node-fetch";
// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

// const GEMINI_API_KEY = "AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM";

// export const atmoService = {
//   msgAi,
// };

// // Helper function to convert chat history to Gemini format
// function convertToGeminiFormat(messages) {
//   return messages.map((msg) => ({
//     role: msg.from === "user" ? "user" : "model",
//     parts: [{ text: msg.text }],
//   }));
// }

// export async function msgAi(messages, user) {
//   const res = await getApiCommand(messages, user);
//   const { text } = res;
//   console.log("text", text);

//   const apiCallRes = await makeApiCall(text);
//   console.log("api", apiCallRes);

//   const AiResponse = await getAiFinalMessage(messages, user, apiCallRes);
//   console.log(AiResponse);
//   return AiResponse;
// }

// async function getApiCommand(messages, user) {
//   try {
//     const lastMsg = messages[messages.length - 1].text;

//     const prompt = `
//       You are Atmo — a multi-cloud assistant for AWS, Azure, and GCP.

//       ## Your Task
//       Generate an AWS CLI command to fulfill the user's request.

//       ## Role Credentials
//       - Role ARN: ${user.cloudPermissions.AWS.arn}
//       - External ID: ${user.cloudPermissions.AWS.externalId}

//       ## Critical Requirements
//       - Output ONLY the AWS CLI command(s) - no explanations, no markdown, no additional text
//       - If you need to assume a role, use this EXACT format:
//         eval $(aws sts assume-role --role-arn ${
//           user.cloudPermissions.AWS.arn
//         } --role-session-name atmo-session --external-id ${
//       user.cloudPermissions.AWS.externalId
//     } --output json | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\\nexport AWS_SESSION_TOKEN=\\(.SessionToken)"') && [your-aws-command-here]
//       - DO NOT use bash variable assignments like STS_OUTPUT=, AWS_ACCESS_KEY_ID=, etc.
//       - DO NOT use intermediate variables or multi-line bash scripts
//       - Use pipes (|) and command substitution where needed
//       - The command runs on an EC2 instance with jq installed
//       - Use --output json and pipe to jq for data processing when appropriate

//       ## User Request
//       ${user?.userName || "Guest"}: ${lastMsg}

//       Command:
//       `;

//     // Build contents array with chat history + new prompt
//     const contents = [
//       ...convertToGeminiFormat(messages.slice(0, -1)), // All previous messages
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ];

//     const body = {
//       contents: contents,
//     };

//     const res = await fetch(
//       "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
//         GEMINI_API_KEY,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Gemini API error: ${res.status} ${text}`);
//     }

//     const data = await res.json();
//     const text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

//     return { from: "ai", text };
//   } catch (err) {
//     console.error("❌ Error communicating with Gemini:", err);
//     return { from: "ai", text: "Sorry, I couldn't process that right now." };
//   }
// }

// async function makeApiCall(command) {
//   try {
//     const { stdout, stderr } = await execAsync(command);

//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//     }

//     console.log(`Output:\n${stdout}`);
//     return stdout;
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     throw error;
//   }
// }

// async function getAiFinalMessage(messages, user, apiCallResult) {
//   try {
//     const lastMsg = messages[messages.length - 1].text;
//     const prompt = `
//       You are Atmo, a multi-cloud assistant specializing in AWS, Azure, and GCP.

//       ## Context
//       - **User**: ${user?.userName || "Guest"}
//       - **Request**: "${lastMsg}"
//       - **API Response**: ${apiCallResult}

//       ## Your Task
//       Provide a clear, helpful explanation of the API response to address the user's request.

//       ## Guidelines
//       - Explain technical results in accessible language
//       - Highlight key information relevant to the user's question
//       - If the API call succeeded, summarize what was accomplished
//       - If there were errors, explain what went wrong and suggest next steps
//       - Be concise but complete
//       - Use formatting (bullet points, code blocks) when it improves clarity
//       `;

//     // Build contents array with chat history + new prompt
//     const contents = [
//       ...convertToGeminiFormat(messages.slice(0, -1)), // All previous messages
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ];

//     const body = {
//       contents: contents,
//     };

//     const res = await fetch(
//       "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
//         GEMINI_API_KEY,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Gemini API error: ${res.status} ${text}`);
//     }

//     const data = await res.json();
//     const text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

//     return { from: "ai", text };
//   } catch (err) {
//     console.error("❌ Error communicating with Gemini:", err);
//     return { from: "ai", text: "Sorry, I couldn't process that right now." };
//   }
// }

export const atmoService = {
  msgAi,
};

export async function msgAi(messages, user) {
  const text = getResponse(messages);

  return { from: "ai", text };
}

function getResponse(messages) {
  const lastMsg = messages[messages.length - 1].text;
  let response = "";
  if (lastMsg.toLowerCase().includes("pay")) {
    response = `
      Based on your AWS billing data, you've spent $1,245.17 on S3 storage over the last 3 months (August through October).
      To give you some context, that averages out to about $415 per month. The main cost drivers are:

      Storage volume: You're storing approximately 14.4 TB of data on average
      API requests: Around 2.3 million GET requests monthly (likely serving files to users)
      Data transfer: About $28/month in outbound data transfer

      Your usage has been fairly consistent, though I noticed a slight uptick in September when storage peaked at 15.2 TB. Overall, these costs align with a moderately data-intensive application—things like user-generated content, backups, or media storage.
    `;
  }
  if (lastMsg.toLowerCase().includes("ec2")) {
    response = `
      In the us-east-1 region, you're managing 6 EC2 instances at the moment. 
      Here's the current state: 3 instances are running normally and processing requests (these include 2 t3.medium instances handling your web tier and 1 m5.large for your application backend).
      2 instances are being created right now—they're going through the launch process and running initial system checks. 
      1 instance is in the terminating phase, meaning it's shutting down gracefully and will be fully decommissioned in the next 1-2 minutes.
    `;
  }
  if (lastMsg.toLowerCase().includes("log")) {
    response = `
      Analysis of logs between 3:30 PM and 4:30 PM shows your request timeouts were caused by database lock contention.
      Root Cause:
      A bulk UPDATE operation on the orders table (started at 4:02 PM) locked 47,238 rows for approximately 13 minutes, blocking all concurrent transactions.
      -------------------------------------------------------------------------------
      Evidence from CloudWatch:
      [16:02:34] UPDATE orders SET status='processed' WHERE order_date < '2025-10-01'
      [16:03:12] Error 1205: Lock wait timeout exceeded (23 blocked queries)
      [16:04:18] Active connections: 142 | Avg wait time: 78.4s
      [16:14:52] Transaction committed after 738s | Locks released
      -------------------------------------------------------------------------------
      Impact: 156 total lock waits, 312.8 seconds cumulative wait time, resulting in cascading request timeouts for any operation touching the orders table."
    `;
  }
  return response;
}
