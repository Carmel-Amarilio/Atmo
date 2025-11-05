import fetch from "node-fetch";
import { exec } from "child_process";

const GEMINI_API_KEY = "AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM";

export const atmoService = {
  msgAi,
};

export async function msgAi(messages, user) {
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

    // const apiResponse = await makeApiCall(text);

    return { from: "ai", text };
  } catch (err) {
    console.error("❌ Error communicating with Gemini:", err);
    return { from: "ai", text: "Sorry, I couldn’t process that right now." };
  }
}

async function makeApiCall(command) {
  try {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`Output:\n${stdout}`);
    });
  } catch (error) {
    console.error("Command failed:", error.message);
    throw error;
  }
}
