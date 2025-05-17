# backend/routers/LLM/chat_llm.py

import os
import httpx
from fastapi import HTTPException

from .chat_db import get_last_messages

# single, fixed prompt
SYSTEM_PROMPT = (
    "You are an expert agricultural assistant. "
    "Help the user analyze their farm sensor data. "
    "Be concise and data-driven."
)

def get_llm_reply(user_id: int, user_message: str) -> str:
    """
    Fetches recent history for user_id, appends the new message,
    sends system_instruction + contents to Gemini, and returns the reply.
    """
    api_key = os.getenv("LLM_API_KEY")
    model   = os.getenv("LLM_MODEL")
    if not (api_key and model):
        raise HTTPException(500, "LLM_API_KEY and LLM_MODEL must be set in .env")

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )

    # build contents from history + new user turn
    contents = []
    for role, msg in get_last_messages(user_id, limit=5):
        api_role = "user" if role == "user" else "model"
        contents.append({
            "role": api_role,
            "parts": [{"text": msg}]
        })
    contents.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": contents
    }

    try:
        resp = httpx.post(url, json=payload, timeout=15.0)
    except httpx.ConnectError as e:
        raise HTTPException(502, f"Could not connect to LLM endpoint: {e}")

    if resp.status_code != 200:
        raise HTTPException(502, f"LLM API error {resp.status_code}: {resp.text}")

    body = resp.json()
    try:
        return body["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise HTTPException(502, "Unexpected LLM response structure")
