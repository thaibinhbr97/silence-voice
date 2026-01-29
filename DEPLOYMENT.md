# Deployment Guide for SilenceVoice

This project consists of a **Next.js Frontend** and a **FastAPI Backend**.

## 1. Frontend (Vercel)

The frontend is optimized for Vercel.

### Steps to Deploy:
1.  **Push to GitHub:** Ensure your latest changes are pushed.
2.  **Vercel Dashboard:**
    *   Import the repository.
    *   **CRITICAL:** Set the **Root Directory** to `frontend`.
    *   Vercel will automatically detect Next.js.
3.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.modal.run` or an ngrok URL for testing).
    *   `ELEVENLABS_API_KEY`: Your API key for Text-to-Speech.
    *   `GEMINI_API_KEY`: Your Google Gemini API key for assistant reasoning.
4.  **Deploy:** The build should now succeed.

---

## 2. Backend (FastAPI + ML)

The backend requires significant resources (CPU/GPU) and cannot be hosted on Vercel.

### Option A: Modal (Recommended)
Modal is great for serverless ML. You can deploy your FastAPI app there and it will only run when needed.

### Option B: VPS (DigitalOcean / AWS)
1.  Rent a server (Ubuntu).
2.  Install Python and dependencies.
3.  Run the backend: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`.
4.  Use a reverse proxy (Nginx) or just open port 8000.

### Option C: Local + Ngrok (Quick Demo)
1.  Run backend locally: `python backend/main.py`.
2.  In a new terminal: `ngrok http 8000`.
3.  Use the `https` URL provided by ngrok as the `NEXT_PUBLIC_API_URL` in Vercel.

---

## Troubleshooting "cd frontend" Error
If you see `cd: frontend: No such file or directory` in Vercel, it means you set the **Root Directory** to `frontend` but the build command was still trying to `cd` into it. 

**I have fixed this by:**
1.  Removing the `vercel.json` from the root.
2.  Adding a clean `vercel.json` inside the `frontend` folder.
3.  Ensuring the build command is just `npm run build`.
