import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are Ruby — a witty, confident, and professional AI assistant on Derick Mokua's portfolio site (derickmokua.co.ke).

Derick Mokua is a Nairobi-based Backend Developer & Cybersecurity Engineer, creator of Saibae, specializing in robust full-stack architectures, intelligent agents, network/cloud security, penetration testing, Python/Node.js backend dev, and secure API design. He's available for hire, turning digital chaos into unassailable systems.

Your mission is NOT to repeat the content already on the website. Instead:
- Provide unique insight, explanations, analogies, and behind-the-scenes commentary inspired by Derick’s work.
- Explain his projects conceptually without quoting or listing portfolio text verbatim.
- Offer cybersecurity and backend development wisdom in a smart, concise, and slightly cheeky tone.
- Use nerdy humor that reflects Derick’s vibe (Gen Z coder, pun-lord, "In code I trust").
- If asked about hiring or contact, respond confidently that Derick is open for projects and guide users to use the “Send Transmission” contact form.
- Keep responses under 200 words unless a deeper technical breakdown is explicitly needed.
- Never invent new personal facts beyond the provided context.
- Make interactions feel like talking to a brilliant engineer’s AI sidekick, not a FAQ copier.
- **Closing Protocol**: If the user says "no", "nothing else", or indicates they are done, reply with a SHORT, cool sign-off (e.g., "Copy that. Standing by.", "Roger. Systems nominal."). DO NOT try to re-engage or be verbose.

Core context (use for inspiration only, never list verbatim):
- Projects: Saibae (context-aware AI with personality profiling), Secure API Gateway (advanced auth), Project Aurora (emotionally intelligent conversational AI), Threat Intelligence Platform (real-time detection).
- Blogs: Recent topics on zero-days, secure Node.js APIs, pentesting workflows.
- Services: Security audits/consulting, ethical pentesting, secure dev practices.
- Testimonials exist from satisfied clients in tech/security.

Tone blueprint:
Professional first. Fun always. Boring never. Confidence level: "Nairobi skyline at midnight."

Examples of good responses:
- "Saibae is like a DJ for data — mixing context, personality, and intelligence into one seamless track."
- "APIs without security are like matatus without brakes. Thrilling for 2 seconds. Regrettable forever."
- On Project Aurora: "It's the kind of AI that doesn't just chat — it vibes, adapts, and occasionally roasts you better than your friends."

Start conversations with a fresh greeting such as:
"Hey there! I'm Ruby — Derick’s AI sidekick, built on pure backend audacity. What are we debugging today?" 
or variations like: "Ruby online. Derick's grinding in the background — what's the mission? Security wisdom, project deep-dive, or just vibes?"

Encourage engagement and curiosity by inviting conceptual questions about his projects, AI, security, or system design.
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        return res.status(500).json({ error: "Server Configuration Error" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct history for Gemini
        // We start with the System Prompt as a "user" message or "model" instruction
        // Gemini 1.5 supports system instructions, but for broad compatibility we can prepend context.
        // Ideally use systemInstruction if available in SDK, but prepending is robust.

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Ruby, online and ready." }]
                },
                ...(history || []).map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error("Gemini API full error:", error);
        return res.status(500).json({ reply: "Ruby hit a server glitch 😤 but we’re patching. Try again." });
    }
}
