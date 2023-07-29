from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elevenlabs import generate, set_api_key

app = FastAPI()

origins = ['http://localhost:3000/']  # put your frontend url here

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


AUDIOS_PATH = "../frontend/src/audios/"
AUDIO_PATH = "/audios/"



@app.get("/voice/{query}")
async def voice_over(query: str):
    set_api_key("befd5e8a8b03e48ea562a90a0c9f9155")  # put your API key here

    audio_path = f'{AUDIOS_PATH}{query[:4]}.mp3'
    file_path = f'{AUDIO_PATH}{query[:4]}.mp3'

    audio = generate(
        text=query,
        voice='Bella',  # premade voice
        model="eleven_monolingual_v1"
    )

    try:
        with open(audio_path, 'wb') as f:
            f.write(audio)

        return file_path

    except Exception as e:
        print(e)

        return ""