import base64
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elevenlabs import generate, set_api_key
import requests
from moviepy.editor import ImageClip, AudioFileClip
import requests # double check


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
IMAGE_PATH = "../backend/out/v1_txt2img_0.png"
AUDIOS_CLIP = "../frontend/src/audios/sound.mp3"
VIDEO_PATH  = "../frontend/src/videos/output.mp4"



def combine_image_and_audio():
    # Load the image
    image_clip = ImageClip(IMAGE_PATH)
    # Load the audio
    audio_clip = AudioFileClip(AUDIOS_CLIP)
    # Set the duration of the video clip to match the audio clip
    image_clip = image_clip.set_duration(audio_clip.duration)
    # Set the audio of the video clip
    video_clip = image_clip.set_audio(audio_clip)
    # Write the result to a file
    video_clip.write_videofile(VIDEO_PATH, codec="libx264", fps=24)
    # Close the clips
    audio_clip.close()
    video_clip.close()




@app.get("/voice/{query}")
async def voice_over(query: str):
    set_api_key("API-KEY")  # put your API key here

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

        combine_image_and_audio()
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
            "Authorization": f"Bearer API-KEY"
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

    combine_image_and_audio()
    
    return "done"
