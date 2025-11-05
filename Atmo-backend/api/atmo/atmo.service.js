import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const GEMINI_API_KEY = "AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM";

export const atmoService = {
  msgAi,
};

export async function msgAi(messages, user) {
  const res = await getApiCommand(messages, user);
  const { text } = res;
  const apiCallRes = await makeApiCall(text);
  const AiResponse = await getAiFinalMessage(messages, user, apiCallRes);
  return { from: "ai", AiResponse };
}

async function getApiCommand(messages, user) {
  try {
    const lastMsg = messages[messages.length - 1].text;

    const prompt = `
      You are Atmo — a multi-cloud assistant for AWS, Azure, and GCP.
      Give practical, concise answers based on the request you are about to receive from the user.
      You need to build a cli command for AWS to get information from a user's cloud.
      The role ARN you will use for this is: ${user.cloudPermissions.AWS.arn}
      The external ID for this role is: ${user.cloudPermissions.AWS.externalId}
      You will ONLY give me the command needed and that's it. No more text.
      You can assume this command will run from INSIDE a cloud environment, on an EC2 instance.
      Here is the user's request:
      User (${user?.userName || "Guest"}): ${lastMsg}
      `;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    return { from: "ai", text };
  } catch (err) {
    console.error("❌ Error communicating with Gemini:", err);
    return { from: "ai", text: "Sorry, I couldn’t process that right now." };
  }
}

async function makeApiCall(command) {
  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    console.log(`Output:\n${stdout}`);
    return stdout;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function getAiFinalMessage(messages, user, apiCallResult) {
  try {
    const lastMsg = messages[messages.length - 1].text;
    const prompt = `
      You are Atmo, a multi-cloud assistant specializing in AWS, Azure, and GCP.

      ## Context
      - **User**: ${user?.userName || "Guest"}
      - **Request**: "${lastMsg}"
      - **API Response**: ${apiCallResult}

      ## Your Task
      Provide a clear, helpful explanation of the API response to address the user's request.

      ## Guidelines
      - Explain technical results in accessible language
      - Highlight key information relevant to the user's question
      - If the API call succeeded, summarize what was accomplished
      - If there were errors, explain what went wrong and suggest next steps
      - Be concise but complete
      - Use formatting (bullet points, code blocks) when it improves clarity
      `;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    return { from: "ai", text };
  } catch (err) {
    console.error("❌ Error communicating with Gemini:", err);
    return { from: "ai", text: "Sorry, I couldn’t process that right now." };
  }
}
