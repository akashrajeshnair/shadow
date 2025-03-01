from datetime import datetime
from app.utils.db import mongo

class HoneypotLog:
    """Handles logging of attack data into MongoDB."""

    @staticmethod
    def log_attack(ip, endpoint, request_data, attack_type, protocol, status):
        """Logs an attack attempt into MongoDB."""
        log_entry = {
            "ip": ip,
            "endpoint": endpoint,
            "request_data": request_data,
            "attack_type": attack_type,
            "protocol": protocol,
            "status": status,
            "timestamp": datetime.utcnow()
        }
        mongo.db.attacks.insert_one(log_entry)

    @staticmethod
    def get_recent_attacks(limit=50):
        """Fetches the most recent attacks from MongoDB."""
        return list(mongo.db.attacks.find().sort("timestamp", -1).limit(limit))

    @staticmethod
    def get_attacks_by_ip(ip):
        """Fetches all attacks from a specific IP."""
        return list(mongo.db.attacks.find({"ip": ip}).sort("timestamp", -1))
