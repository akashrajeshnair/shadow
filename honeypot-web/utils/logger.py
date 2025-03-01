import json
import logging
import os
from datetime import datetime
from db.models import attack_logs, fake_users

# Ensure the logs directory exists
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "attack_logs.log")

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Ensure the log file exists
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, "w") as f:
        f.write("")

# Configure logging to a file
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(message)s",
)

def log_attack(request, payload=None):
    """
    Logs attacks to MongoDB and a local file.

    :param request: Flask request object
    :param payload: GET/POST parameters
    """
    attack_data = {
        "ip": request.remote_addr,
        "user_agent": request.headers.get("User-Agent", "Unknown"),
        "endpoint": request.path,
        "method": request.method,
        "headers": dict(request.headers),
        "payload": payload or {},
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Save to MongoDB
    attack_logs.insert_one(attack_data)

    # Save to log file
    logging.info(json.dumps(attack_data, indent=2))

    print(f"Attack logged from {request.remote_addr} on {request.path}")

def log_login_attempt(request, username, password):
    """
    Logs fake login attempts to MongoDB and a local log file.

    :param request: Flask request object
    :param username: Entered username
    :param password: Entered password
    """
    login_data = {
        "username": username,
        "password": password,
        "ip": request.remote_addr,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Save to MongoDB
    fake_users.insert_one(login_data)

    # Save to log file
    logging.info(f"Fake login attempt: {json.dumps(login_data, indent=2)}")

    print(f"[!] Fake login attempt detected from {request.remote_addr} (Username: {username})")
