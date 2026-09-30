from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title="IntentSQL AI API",
)

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# Routes
# ------------------------------------------------------------

# ------------------------------------------------------------
# Root
# ------------------------------------------------------------


@app.get("/")
def root():
    return {"message": "IntentSQL AI API is running successfully"}
