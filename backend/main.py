from fastapi import FastAPI
from routers import devices, auth  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. Later you can specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router)  # ✅ Attach the router
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "IoT Backend is running 🚀"}
