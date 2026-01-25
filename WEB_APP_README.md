# Chaplin Web Application

A modern, accessible web application that converts Chaplin's Visual Speech Recognition (VSR) tool into a user-friendly interface for mute individuals.

## Project Structure

```
chaplin/
├── backend/              # FastAPI backend for VSR processing
│   └── main.py          # API server with /process-video endpoint
├── frontend/            # Next.js web application
│   ├── src/
│   │   ├── app/        # Next.js app router pages
│   │   └── components/ # React components
│   └── package.json
├── pipelines/          # Original VSR model code
├── configs/            # Model configuration files
└── benchmarks/         # Pre-trained model files
```

## Setup Instructions

### 1. Backend Setup

The backend runs the VSR model and LLM correction.

```bash
# Install backend dependencies
pip install -r requirements.txt
pip install -r backend_requirements.txt

# Make sure Ollama is running with qwen3:4b model
ollama pull qwen3:4b

# Start the FastAPI server
cd backend
python main.py
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

The frontend provides the user interface.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Start both servers**: Backend (port 8000) and Frontend (port 3000)
2. **Grant camera permissions** when prompted by the browser
3. **Align your face** with the tracking box overlay
4. **Click "Tap to Speak"** to start recording
5. **Mouth your words** clearly while recording
6. **Click "Stop Recording"** when done (minimum 2 seconds)
7. **Wait for processing** - the transcription will appear on the right
8. **Click "Speak Out Loud"** to use Text-to-Speech

### Quick Phrases

Use the sidebar to instantly speak common phrases without recording.

## Features

- ✅ Real-time camera feed with visual alignment guide
- ✅ Visual Speech Recognition (VSR) using Auto-AVSR model
- ✅ LLM-powered text correction (Ollama + Qwen3:4b)
- ✅ Text-to-Speech (TTS) for speaking transcriptions
- ✅ Quick phrases for common expressions
- ✅ Modern, accessible UI with dark mode
- ✅ Glassmorphism design with smooth animations

## API Endpoints

### `POST /process-video`
Processes a video file and returns transcribed text.

**Request**: `multipart/form-data` with video file

**Response**:
```json
{
  "raw_output": "HELLO WORLD",
  "corrected_text": "Hello world.",
  "list_of_changes": "Capitalization corrected, punctuation added"
}
```

### `GET /health`
Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu"
}
```

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **PyTorch**: Deep learning framework for VSR model
- **ESPnet**: Speech processing toolkit
- **Ollama**: Local LLM inference
- **MediaPipe**: Face landmark detection

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Web APIs**: MediaDevices (camera), MediaRecorder, SpeechSynthesis (TTS)

## Notes

- The VSR model requires at least 2 seconds of video to process
- Camera feed is mirrored for better user experience
- Videos are processed server-side and automatically cleaned up
- TTS uses the browser's built-in speech synthesis
