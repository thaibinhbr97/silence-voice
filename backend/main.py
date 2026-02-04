import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import sys
from pathlib import Path

# Add the project root to sys.path and set it as CWD
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))
os.chdir(root_dir)

import asyncio
import tempfile
from typing import Optional

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from silencevoice import SilenceVoiceOutput
from pipelines.pipeline import InferencePipeline


class TranscriptionResponse(BaseModel):
    raw_output: str
    corrected_text: str
    list_of_changes: str


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the VSR model at startup to avoid reloading for each request."""
    global vsr_model
    
    config_filename = str(root_dir / "configs" / "LRS3_V_WER19.1.ini")
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    
    print(f"Loading VSR model on {device}...")
    try:
        vsr_model = InferencePipeline(
            config_filename,
            device=device,
            detector="mediapipe",
            face_track=True
        )
        print("✅ VSR Model loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load VSR model: {e}")
        
    yield
    # Clean up if needed
    print("Shutting down...")

app = FastAPI(title="SilenceVoice VSR API", version="1.0.0", lifespan=lifespan)

@app.get("/")
async def root():
    """Root endpoint to verify backend is running."""
    return {"message": "SilenceVoice VSR API is running", "status": "healthy"}

# CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from google import genai
from google.genai import types

# Global VSR model instance (loaded once at startup)
vsr_model: Optional[InferencePipeline] = None

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("⚠️ GEMINI_API_KEY not found in environment variables")
    client = None




import json


# Define the output model locally to avoid version conflicts with silencevoice.py
class SilenceVoiceOutput(BaseModel):
    list_of_changes: str
    corrected_text: str

import time

async def correct_output_async(output: str) -> dict:
    """Use Gemini to correct the raw VSR output with manual parsing for robustness."""
    print(f"🤖 Starting LLM correction for: '{output}'", flush=True)
    start_time = time.time()
    
    try:
        if not client:
            raise Exception("Gemini client not configured. Please set GEMINI_API_KEY.")

        prompt = (
            "You are an assistant that helps make corrections to the output of a lipreading model. "
            "Return the corrected text in a JSON format with 'list_of_changes' and 'corrected_text' keys. "
            "Example JSON: {\"list_of_changes\": \"Fixed spelling\", \"corrected_text\": \"Hello world.\"}\n\n"
            f"Transcription to fix:\n\n{output}"
        )

        # Wrap the Gemini call with a timeout
        response = await asyncio.wait_for(
            asyncio.to_thread(
                client.models.generate_content,
                model='gemini-3-flash-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=150,
                    response_mime_type="application/json",
                )
            ),
            timeout=0.5
        )
        
        # Parse the content
        content = response.text
        if not content:
            print("⚠️ LLM returned empty response", flush=True)
            raise ValueError("Empty response from LLM")
            
        print(f"DEBUG: LLM Response: {content}", flush=True)
        
        # Clean markdown if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
            
        data = json.loads(content)
        
        corrected_text = data.get('corrected_text', output.capitalize()).strip()
        if corrected_text and corrected_text[-1] not in ['.', '?', '!']:
            corrected_text += '.'
            
        end_time = time.time()
        duration = end_time - start_time
        print(f"✅ LLM Correction successful in {duration:.2f} seconds", flush=True)
        
        return {
            "corrected_text": corrected_text,
            "list_of_changes": data.get('list_of_changes', "Standard correction")
        }
    except asyncio.TimeoutError:
        end_time = time.time()
        duration = end_time - start_time
        print(f"⚠️ LLM Correction timed out after {duration:.2f} seconds", flush=True)
        return {
            "corrected_text": output.capitalize() + ".",
            "list_of_changes": "LLM timeout, used raw output"
        }
    except Exception as e:
        end_time = time.time()
        duration = end_time - start_time
        print(f"⚠️ LLM Correction failed after {duration:.2f} seconds: {str(e)}", flush=True)
        return {
            "corrected_text": output.capitalize() + ".",
            "list_of_changes": "LLM unavailable, used raw output"
        }

@app.post("/process-video", response_model=TranscriptionResponse)
async def process_video(video: UploadFile = File(...)):
    """Process a video file and return the transcribed text."""
    if not vsr_model:
        raise HTTPException(status_code=503, detail="VSR model not loaded")
    
    # Save uploaded file to temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
        content = await video.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Perform VSR inference
        raw_output = vsr_model(tmp_path)
        print(f"Raw VSR Output: {raw_output}", flush=True)
        
        # Get correction (this function now handles its own errors)
        correction_data = await correct_output_async(raw_output)
        
        return TranscriptionResponse(
            raw_output=raw_output,
            corrected_text=correction_data["corrected_text"],
            list_of_changes=correction_data["list_of_changes"]
        )
    
    except Exception as e:
        print(f"❌ Critical Processing error: {str(e)}", flush=True)
        # Even on critical error, try to return something so the frontend doesn't hang
        return TranscriptionResponse(
            raw_output="Error",
            corrected_text="I'm sorry, there was an error processing the video.",
            list_of_changes=str(e)
        )
    
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": vsr_model is not None,
        "device": str(vsr_model.model.device) if vsr_model else "N/A"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
