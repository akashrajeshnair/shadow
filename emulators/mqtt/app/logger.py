from pymongo import MongoClient
import datetime

# Connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["honeypot"]
logs_collection = db["attack_logs"]

def log_attack(ip, device, command, data, response):
    """Log attacker actions in MongoDB with a structured schema."""
    log_entry = {
        "timestamp": datetime.datetime.utcnow(),
        "attacker_ip": ip,
        "device": device,
        "command": command,
        "data": data,
        "response": response
    }
    logs_collection.insert_one(log_entry)
