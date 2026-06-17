# AGENTS.md

Instructions for AI coding agents working on this project.

## Build & Run

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (outputs to dist/)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Project Rules

1. **Never commit `.env`** — API keys are in `.env`, which is gitignored. Use `.env.example` as template.
2. **All UI text in Traditional Chinese** — Labels, placeholders, buttons, prompts all use 繁體中文.
3. **API calls go through service layer** — Keep fetch logic in `src/services/`, components only import and call service functions.
4. **Dynamic import for heavy services** — Groq service uses `await import()` to enable code splitting.
5. **TypeScript strict** — All props and API responses must be typed. Types in `src/types.ts`.
6. **Tailwind v4** — Uses `@import "tailwindcss"` in `src/index.css`, no `tailwind.config.js`.

## Adding a new LLM provider

1. Create `src/services/<provider>.ts`
2. Export an `analyzeTranscript(transcript: string): Promise<MeetingResult>` function
3. Add env var to `.env` and `.env.example` (prefixed with `VITE_`)
4. Update `src/App.tsx` import

## File Structure

```
.env                  # API keys (gitignored)
.env.example          # API key template
src/
  services/           # API service functions
    claude.ts         # Anthropic Claude API
    groq.ts           # Groq Whisper API
  components/         # React components
  types.ts            # Shared TypeScript interfaces
  App.tsx             # Root component
  main.tsx            # Entry point
  index.css           # Tailwind import
```
