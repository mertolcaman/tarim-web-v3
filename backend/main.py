from fastapi import FastAPI
from routers.devices import router as devices_router
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from routers.LLM.chat import router as chat_router 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices_router)
app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {"message": "IoT Backend is running 🚀"}
