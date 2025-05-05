from fastapi import FastAPI
from routers import devices
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(devices.router)
app.include_router(auth_router)  # Now only adds "/auth", not "/auth/auth"

@app.get("/")
def read_root():
    return {"message": "IoT Backend is running 🚀"}
