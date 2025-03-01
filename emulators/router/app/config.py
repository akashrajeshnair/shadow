import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

MONGO_URI = "mongodb://mongodb:27017/"
DATABASE_NAME = os.getenv("DATABASE_NAME", "fake_router")
# LOG_FILE = "honeypot.log"
FLASK_DEBUG = True
