from db import db

attack_log_schema = {
    "ip": str,             # Attacker's IP address
    "user_agent": str,     # Browser/User Agent
    "endpoint": str,       # Targeted endpoint
    "method": str,         # HTTP Method (GET, POST, etc.)
    "headers": dict,       # Request headers
    "payload": dict,       # Data sent in request (GET/POST params)
    "timestamp": str       # Time of attack (ISO format)
}

fake_user_schema = {
    "username": str,
    "password": str,   # Store fake passwords (NOT real users)
    "ip": str,
    "timestamp": str
}


if "attack_logs" not in db.list_collection_names():
    db.create_collection("attack_logs")
    db.command("collMod", "attack_logs", validator={"$jsonSchema": {"bsonType": "object", "properties": attack_log_schema}})

if "fake_users" not in db.list_collection_names():
    db.create_collection("fake_users")
    db.command("collMod", "fake_users", validator={"$jsonSchema": {"bsonType": "object", "properties": fake_user_schema}})


attack_logs = db.attack_logs
fake_users = db.fake_users
