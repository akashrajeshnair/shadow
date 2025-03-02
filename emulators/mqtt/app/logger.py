from pymongo import MongoClient, errors
import datetime
import time

def get_mongo_client(uri, retries=5, delay=2):
    for i in range(retries):
        try:
            client = MongoClient(uri)
            # The ismaster command is cheap and does not require auth.
            client.admin.command('ismaster')
            return client
        except errors.ServerSelectionTimeoutError:
            if i < retries - 1:
                time.sleep(delay)
            else:
                raise

# Connect to MongoDB
client = get_mongo_client("mongodb://mongodb:27017/")
db = client["honeypot"]
logs_collection = db["mqtt_logs"]

def log_attack(ip, device, command, data, response):
    """Log attacker actions in MongoDB with a structured schema."""
    log_entry = {
        "timestamp": datetime.datetime.utcnow(),
        "ip": ip,
        "device": device,
        "command": command,     
        "data": data,
        "response": response
    }
    logs_collection.insert_one(log_entry)
