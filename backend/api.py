import base64
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elevenlabs import generate, set_api_key
import requests

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

    audio_path = f'{AUDIOS_PATH}sound.mp3'
    file_path = f'{AUDIO_PATH}sound.mp3'

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


@app.get("/image/{query}")
async def imagegen(query: str):

    engine_id = "stable-diffusion-xl-1024-v1-0"

    response = requests.post(
        f"https://api.stability.ai/v1/generation/{engine_id}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer sk-Xg6MSxMXbrxDhKh9DAwpLyUAK7QH9qw903JUMgrRIIVZEbyY"
        },
        json={
            "text_prompts": [
                {
                    "text": query
                }
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        },
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()

    for i, image in enumerate(data["artifacts"]):
        with open(f"./out/v1_txt2img_{i}.png", "wb") as f:
            f.write(base64.b64decode(image["base64"]))
    
    return "done"
