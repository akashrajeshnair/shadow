from pymongo import MongoClient
from config import MONGO_URI
from datetime import datetime

client = MongoClient(MONGO_URI)
db = client.honeypot
logs_collection = db.ssh_logs

def log_ssh_attempt(ip, username, password):
    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": "SSH",
        "ip": ip,
        "command": "LOGIN",
        "data": {"username": username, "password": password},
        "response": "Login attempt logged"
    }
    logs_collection.insert_one(log_entry)

def log_command(ip, command, response):
    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": "SSH",
        "ip": ip,
        "command": command,
        "data": None,
        "response": response
    }
    logs_collection.insert_one(log_entry)