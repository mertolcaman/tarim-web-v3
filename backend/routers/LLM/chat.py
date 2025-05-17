from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .chat_db import save_message, get_last_messages
from .chat_llm import get_llm_reply


router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    user_id: int
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    # 1) persist the user’s message
    save_message(req.user_id, "user", req.message)

    # 2) get the assistant’s reply from the LLM
    assistant_text = get_llm_reply(req.user_id, req.message)
    if not assistant_text:
        raise HTTPException(502, "Empty reply from LLM")

    # 3) persist the assistant’s reply
    save_message(req.user_id, "assistant", assistant_text)

    # 4) return it to the client
    return ChatResponse(reply=assistant_text)


@router.get("/history/{user_id}")
def chat_history(user_id: int, limit: int = 20):
    """
    Returns up to `limit` previous messages for this user,
    in chronological order.
    """
    msgs = get_last_messages(user_id, limit)
    return [{"role": r, "message": m} for r, m in msgs]