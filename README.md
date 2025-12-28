<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pKOUB3Ufg_1XNAIr45TLugfnISMPOwzs

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Docker
------
Build and serve the production bundle with Docker + nginx:

```bash
# Build the image (passes `VITE_GEMINI_API_KEY` at build time — not recommended for secrets)
docker build --build-arg VITE_GEMINI_API_KEY="$VITE_GEMINI_API_KEY" -t nichenavigator:latest .

# Run the container (map port 8080 locally)
docker run -e VITE_GEMINI_API_KEY="$VITE_GEMINI_API_KEY" -p 8080:80 nichenavigator:latest
```

Security note
-------------
- The current app uses the Gemini API key at build/runtime and injects it into the frontend bundle. For production you should never expose private API keys in client-side code — run the `@google/genai` call from a server-side function or proxy that keeps the key secret.

Example `.env` file
-------------------
Create a local `.env.local` (do not commit) containing:

```
VITE_GEMINI_API_KEY=your_real_key_here
```

See `.env.example` for a template.
