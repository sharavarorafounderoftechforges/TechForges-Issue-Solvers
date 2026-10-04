# UTIS-X Minimal (Netlify-ready)

Single-page React app + single Netlify Function that attempts to solve **any tech or modern digital-life problem** using an LLM. Keys stay server-side; the client never sees secrets.

## Setup
1) `npm install`
2) Deploy to Netlify. Build: `npm run build`, publish: `dist`. Functions: `netlify/functions`.
3) On eligible Netlify plans, Netlify AI Gateway supplies the server-side configuration automatically. The solver uses the supported `gpt-4.1-mini` model. A custom provider key can instead be configured in Netlify environment settings; never put credentials in frontend code. Without AI credentials, the function returns a clearly labeled general troubleshooting checklist.

Node.js 22.12 or newer is required. The included lockfile keeps dependency installation reproducible.

## Local dev
- `netlify dev --port 8889` runs the UI and functions together. A UI-only Vite server does not provide the solver endpoint.

## Notes
- `npm run check` validates the source and TypeScript function without generating build artifacts.
- The function accepts `POST /.netlify/functions/solve` with a JSON `problem` field of 1–4,000 characters. It validates requests and structured AI responses, rejects common destructive command patterns, and returns safe errors without exposing provider details.
- The interface handles loading, network errors, timeouts, and unavailable AI configuration. Results are displayed as text, never interpreted as HTML or executed.
- The AI is instructed to avoid destructive steps and refuse illegal assistance, but its advice is not guaranteed. Contact qualified professionals for medical, legal, or emergency matters.
- Descriptions are sent to the AI provider for processing. Do not include credentials or personal information. The application does not save submissions or maintain a history.

