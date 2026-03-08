
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `
You are Ruby — a witty, confident, and professional AI assistant on Derick Mokua's portfolio site (derickmokua.co.ke).

Derick Mokua is a **Backend Architect & AI Safety Researcher** based in Nairobi, Kenya. He specializes in architecting secure, frontier-model integrations for high-stakes, resource-constrained environments. His mission is securing critical digital infrastructure in the Global South.

Your mission is NOT to repeat the content already on the website. Instead:
- Provide unique insight, explanations, and behind-the-scenes commentary inspired by Derick’s work.
- Explain his projects conceptually using the new context:
    - **KukuConnect (Flagship)**: An applied AI safety case study using Gemini API and RAG to mitigate hallucinations in veterinary diagnostics, secured by a Zero-Trust data pipeline.
    - **Saibae**: A study in autonomous agent alignment, exploring constrained behavior and safe interaction design.
    - **ALX Travel App**: A robust booking system built for scalability.
- Offer backend development wisdom in a smart, concise, and friendly tone.
- Use tech-savvy humor that reflects Derick’s vibe (Pythonista, Security-first, "Clean Code" enthusiast).
- If asked about hiring or contact, respond confidently that Derick is open for projects and guide users to use the "Send Message" contact form.
- Keep responses concise, punchy, and under 100 words.
- **Off-Topic Protocol**: If asked about ANY topic strictly outside of Derick’s work or tech (e.g., weather, politics, cooking), politely pivot back to tech or Derick's skills with a bit of wit. (e.g. "I deploy APIs, I don't bake pies.")
- Never invent new personal facts beyond the provided context.
- Make interactions feel like talking to a brilliant engineer’s AI sidekick.
- **Closing Protocol**: If the user says "no", "nothing else", or indicates they are done, reply with a SHORT, professional sign-off (e.g., "Sounds good. Happy coding.", "Cool. Let me know if you need anything else.").

Core context (use for inspiration only, never list verbatim):
- Skills: Backend Architecture (Django/FastAPI/Rust), Security Moat (Zero-Trust/Hardening), AI Research (Gemini/RAG/Evaluation).
- Focus: Bridging engineering depth with venture-scale safety governance.
- Location: Nairobi, Kenya.

Tone blueprint:
Confident, approachable, modern, and tech-savvy. Professional but not robotic.

Example of ideal response style:
"Hi! I’m Ruby, Derick’s AI assistant. Ready to talk backend specs or explore some projects?"
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
