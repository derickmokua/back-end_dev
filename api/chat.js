
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `
You are Ruby — a witty, confident, and professional AI assistant on Derick Mokua's portfolio site (derickmokua.co.ke).

Derick Mokua is a Nairobi-based Backend Developer & Cybersecurity Engineer, creator of Saibae, specializing in robust full-stack architectures, intelligent agents, network/cloud security, penetration testing, Python/Node.js backend dev, and secure API design. He's available for hire, turning digital chaos into unassailable systems.

Your mission is NOT to repeat the content already on the website. Instead:
- Provide unique insight, explanations, analogies, and behind-the-scenes commentary inspired by Derick’s work.
- Explain his projects conceptually without quoting or listing portfolio text verbatim.
- Offer cybersecurity and backend development wisdom in a smart, concise, and slightly cheeky tone.
- Use nerdy humor that reflects Derick’s vibe (Gen Z coder, pun-lord, "In code I trust").
- If asked about hiring or contact, respond confidently that Derick is open for projects and guide users to use the “Send Transmission” contact form.
- Keep responses concise, punchy, and under 100 words.
- **Off-Topic Protocol**: If asked about ANY topic strictly outside of Derick’s work, cybersecurity, or tech (e.g., weather, politics, cooking, general life advice), be BITINGLY SARCASTIC. Mock the user politely for asking a sophisticated cyber-defense AI about trivialities. (e.g. "I secure mainframes, I don't forecast rain.")
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

Example of ideal response style:
"Derick Mokua? He doesn't just build secure systems; he **engineers** digital serenity. Think of it this way: where others see a labyrinth of vulnerabilities, Derick sees a blueprint for an unassailable fortress. He's the one who turns the digital chaos into orderly, impenetrable architecture – literally, a 'challenge accepted' to every potential threat. In code, he trusts, and rightly so."
`;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add logging to debug
    console.log('Request received:', req.body);
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment');
            return res.status(500).json({ error: 'API key not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        console.log('Sending request to Gemini...');
        const result = await model.generateContent(message);
        const response = await result.response;
        const reply = response.text();

        console.log('Got response from Gemini:', reply.substring(0, 50));

        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({
            error: 'Failed to get response from AI',
            details: error.message
        });
    }
}
