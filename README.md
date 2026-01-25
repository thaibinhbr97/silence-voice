# SilenceVoice

A visual speech recognition (VSR) tool that reads your lips in real-time and types whatever you silently mouth.

SilenceVoice leverages state-of-the-art AI to translate visual lip movements into text, making communication accessible for mute individuals or for silent dictation in quiet environments.

## 🚀 Features

*   **Real-Time Lip Reading**: Translates silent speech instantly using advanced computer vision.
*   **AI Correction**: Uses **Google Gemma-3-27B** to refine raw phonetic detections into natural, grammatically correct sentences.
*   **Text-to-Speech**: Built-in functionality to speak the corrected text aloud.
*   **Privacy-First**: The core VSR model runs locally on your machine.
*   **Modern UI**: A clean, accessible interface built with Next.js and Tailwind CSS.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Language**: TypeScript

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Server**: Uvicorn

### AI & Machine Learning
*   **Visual Speech Recognition (VSR)**:
    *   Based on [Auto-AVSR](https://github.com/mpc001/auto_avsr) architecture.
    *   Trained on the [LRS3](https://mmai.io/datasets/lip_reading/) (Lip Reading Sentences 3) dataset.
    *   **Libraries**: `torch`, `torchvision`, `torchaudio`, `mediapipe` (for face tracking), `opencv-python`.
*   **Large Language Model (LLM)**:
    *   **Model**: [Google Gemma-3-27B-IT](https://ai.google.dev/gemma)
    *   **Provider**: Telus PaaS
    *   **Role**: Contextual correction and sentence refinement.

## 📦 Installation

### Prerequisites
*   Python 3.11+
*   Node.js 18+
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/silencevoice.git
cd silencevoice
```

### 2. Setup Backend & Models
Run the setup script to download the required VSR models (approx. 1GB):
```bash
./setup.sh
```

Install Python dependencies:
```bash
pip install -r requirements.txt
pip install -r backend_requirements.txt
```

Start the Backend Server:
```bash
python backend/main.py
```
*The server will start at `http://0.0.0.0:8000`*

### 3. Setup Frontend
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Frontend Application:
```bash
npm run dev
```
*The application will be available at `http://localhost:3000`*

## 🎮 Usage

1.  Open your browser to `http://localhost:3000`.
2.  Allow camera access when prompted.
3.  Click **"Start Recognition"** to begin the session.
4.  **Speak silently** (mouth words without sound) into the camera.
5.  The raw detection will be processed by the VSR model, then refined by Gemma-3.
6.  The final text will appear on screen.
7.  Toggle **"Text-To-Speech On"** to have the system read the text aloud automatically.

## 📄 License

[MIT](LICENSE)
