import os
from openai import OpenAI
client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)
print("Testing audio...")
# create a dummy mp3
with open("dummy.mp3", "wb") as f:
    f.write(b"ID3")

try:
    with open("dummy.mp3", "rb") as f:
        res = client.audio.transcriptions.create(model="whisper-1", file=f)
        print(res)
except Exception as e:
    print(f"Error: {e}")
