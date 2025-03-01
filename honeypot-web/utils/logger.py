import json
import logging
from datetime import datetime 
from db.models import attack_logs, fake_users

logging.basicConfig(
    filename="logs/attack_logs",
    level=logging.INFO,
    format="%(asctime)s - %(message)s"
    )

def log_attack(request, payload=None):
    """
    Logs attacks to MongoDB and a local file

    request: Flask request object
    payload: GET/POST parameters
    """

    attack_data = {
        "ip": request.remote_addr,
        "user_agent": request.headers.get("User-Agent", "Unknown"),
        "endpoint": request.path,
        "method": request.method,
        "headers": dict(request.headers),
        "payload": payload or {},
        "timestamp": datetime.now().isoformat()
    }

    attack_logs.insert_one(attack_data)

    logging.info(json.dumps(attack_data))

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
        "timestamp": datetime.utcnow().isoformat()
    }


    fake_users.insert_one(login_data)

    logging.info(f"Fake login attempt: {json.dumps(login_data, indent=2)}")

    print(f"[!] Fake login attempt detected from {request.remote_addr} (Username: {username})")