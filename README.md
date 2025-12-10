# UTIS-X Minimal (Netlify-ready)

Single-page React app + single Netlify Function that attempts to solve **any tech or modern digital-life problem** using an LLM. Keys stay server-side; the client never sees secrets.

## Setup (zero extra steps)
1) `npm install`
2) Deploy to Netlify. Build: `npm run build`, publish: `dist`. Functions: `netlify/functions`.
3) Optional for live LLM answers: set `OPENAI_API_KEY` (and optional `OPENAI_MODEL`, `OPENAI_API_URL`) in Netlify env vars. Without the key, the function still deploys and returns a fallback message.

## Local dev
- `npm run dev` for the UI.
- `netlify dev` to run UI + functions together.

## Notes
- The function enforces JSON-only responses and strips destructive commands.
- For emergencies or illegal content, the function responds with safe guidance/refusal. Advisory only; contact appropriate professionals for medical/legal/emergency matters.

