from datetime import datetime
from database import logs_collection

def log_request(command, data, response, ip, device):
    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": device,
        "ip": ip,
        "command": command,
        "data": data,
        "response": response
    }
    logs_collection.insert_one(log_entry)
