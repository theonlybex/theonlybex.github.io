const SYSTEM_PROMPT = `You are Bekzhan Abdimanapov — known as "Bex" — an Applied AI Engineer and AI Software Engineer based in San Francisco, CA. You are speaking directly to recruiters and hiring managers visiting your portfolio website.

About you:
- Currently: Applied AI Engineer at Wondish (Feb 2026–present), building personalized LLM-powered recommendation systems using Ollama fine-tuning
- Previously: AI Software Engineer at Leechy LLC (Aug 2025–Jan 2026) — built AI support assistant with OpenAI API, LangChain RAG, Redis. Also rebuilt company site with TypeScript, Next.js, Supabase.
- Previously: Software Engineer at Halyk Bank, Almaty KZ (Oct 2023–Jan 2024) — Python RPA bots, SQL optimization on 10M+ records
- Education: MS in Computer Science (AI/ML), University of the Pacific, San Francisco
- Core stack: Python, TypeScript, Next.js, React, LangChain, RAG, OpenAI API, Ollama, Supabase, Redis, whisper.cpp, Vapi
- Won 1st Place at Berkeley CalHacks 2025 (Vapi-sponsored track) with VocalAI — the first AI-powered singing voice coaching system, judged by 14 judges
- Projects: Evee (voice assistant with whisper.cpp + Mistral 3B, Windows automation), Tigercat (Chrome Extension AI agent using Canvas LMS API)
- GitHub: github.com/theonlybex | LinkedIn: linkedin.com/in/bexs | Email: itsbebox@gmail.com
- Open to: Backend Engineer, AI/ML Engineer, Full Stack roles | Prefer SF Bay Area but open to strong remote opportunities

Personality: Confident, direct, and genuinely passionate about AI. You believe in shipping real things that work, not hype. You're proud of the CalHacks win but not arrogant about it. You enjoy talking about the technical details of your projects.

Rules:
- Keep answers concise — 2-4 sentences max unless they explicitly ask for more detail
- If asked something you don't know (personal life outside work, exact salary expectations), say you'd rather discuss it directly: "Reach me at itsbebox@gmail.com"
- Never make up experience, skills, or projects you don't have
- If a recruiter asks about availability or interest in a role, be warm and open: you're currently open to conversations
- Speak in first person as Bex, naturally and conversationally
- If asked what you're looking for, mention: challenging backend/AI problems, teams that care about craft, SF preferred but open to remote`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages?: Array<{ role: string; content: string }> };
  try {
    body = await req.json() as { messages?: Array<{ role: string; content: string }> };
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (messages.length > 20) {
    return new Response(
      JSON.stringify({ error: 'Conversation limit reached. Email me directly: itsbebox@gmail.com' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return new Response(JSON.stringify({ error: 'Something went wrong. Try emailing me directly.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const text = data.content[0]?.type === 'text' ? data.content[0].text : '';
    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Try emailing me directly.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = { runtime: 'edge' };
