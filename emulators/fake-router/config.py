import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "fake_router")
LOG_FILE = "honeypot.log"
FLASK_DEBUG = True
