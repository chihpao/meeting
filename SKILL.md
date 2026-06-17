# Meeting Minutes Generator Skill

This project is a React SPA that converts meeting transcripts or audio recordings into structured meeting minutes using AI.

## How it works

1. **Audio input** (optional) — User uploads an audio file → Groq Whisper large-v3 transcribes to text → auto-filled into the transcript textarea
2. **Text input** — User pastes or edits the meeting transcript
3. **AI analysis** — Claude Haiku 4.5 analyzes the transcript and outputs a structured JSON with title, date, attendees, summary, discussion points, decisions, action items, risks, and next meeting
4. **Render** — Results are rendered with action items in a table, risks as red cards, and a copy button for full text

## API Services

### Claude (`src/services/claude.ts`)
- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-haiku-4-5-20251001`
- Auth: `x-api-key` header with `VITE_ANTHROPIC_API_KEY`
- Browser access: `anthropic-dangerous-direct-browser-access: true` header required

### Groq (`src/services/groq.ts`)
- Endpoint: `https://api.groq.com/openai/v1/audio/transcriptions`
- Model: `whisper-large-v3`
- Auth: `Authorization: Bearer` header with `VITE_GROQ_API_KEY`
- Body: `FormData` with `file`, `model`, `response_format`

## Tech Stack

- React 19, TypeScript, Vite, Tailwind CSS v4
- No additional state management libraries (pure React useState)
- Dynamic import for Groq service (code splitting)

## Key Conventions

- All UI text is in Traditional Chinese (繁體中文)
- Prompt engineers for Chinese output with explicit system prompt instructions
- Priority/Level values: 高 (High), 中 (Medium), 低 (Low)
- Date format: YYYY-MM-DD
- API keys read from import.meta.env (Vite env vars)
- Output JSON type: `MeetingResult` defined in `src/types.ts`
