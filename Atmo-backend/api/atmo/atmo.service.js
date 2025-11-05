import fetch from "node-fetch"

const GEMINI_API_KEY='AIzaSyAjQEq-fZjulJezlvKRiOB67ZkIIQ9jGFM'

export const atmoService = {
  msgAi
}

export async function msgAi(messages, user) {
  try {
    const lastMsg = messages[messages.length - 1].text

    const prompt = `
You are Atmo — a multi-cloud assistant for AWS, Azure, and GCP.
Give practical, concise answers about cost, performance, and security.

User (${user?.userName || "Guest"}): ${lastMsg}
`

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    }

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    )

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Gemini API error: ${res.status} ${text}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response."

    return { from: "ai", text }
  } catch (err) {
    console.error("❌ Error communicating with Gemini:", err)
    return { from: "ai", text: "Sorry, I couldn’t process that right now." }
  }
}
